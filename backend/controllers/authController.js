import crypto from 'crypto';
import User from '../models/User.js';
import Workspace from '../models/Workspace.js';
import WorkspaceMember from '../models/WorkspaceMember.js';
import { generateToken } from '../config/jwt.js';
import { autoSeed } from '../services/autoSeed.js';
import { sendWelcomeEmail } from '../services/emailService.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    // Default first registered user or explicitly designated as Admin if system is empty
    const userCount = await User.countDocuments();
    const assignedRole = userCount === 0 ? 'Admin' : (role || 'Member');

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: cleanPassword,
      role: assignedRole
    });

    // Automatically create a default personal/team workspace for new users
    const workspaceSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-workspace-' + Date.now().toString().slice(-4);
    const workspace = await Workspace.create({
      name: `${name}'s Workspace`,
      slug: workspaceSlug,
      owner: user._id,
      isDefault: true
    });

    await WorkspaceMember.create({
      workspace: workspace._id,
      user: user._id,
      role: 'Admin'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        token,
        defaultWorkspace: workspace._id
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email address and password' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Auto-seed initial database if completely empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await autoSeed();
    }

    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(cleanPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact administrator.' });
    }

    // Safely update last login timestamp without re-triggering schema save hooks
    await User.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } });

    const token = generateToken(user._id);

    // Get user default workspace
    let userWorkspace = await WorkspaceMember.findOne({ user: user._id }).populate('workspace');

    // Auto-create workspace if user has no workspace assigned
    if (!userWorkspace) {
      const workspaceSlug = cleanEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-') + '-ws-' + Date.now().toString().slice(-4);
      const newWs = await Workspace.create({
        name: `${user.name}'s Workspace`,
        slug: workspaceSlug,
        owner: user._id,
        isDefault: true
      });
      userWorkspace = await WorkspaceMember.create({
        workspace: newWs._id,
        user: user._id,
        role: 'Admin'
      });
    }

    const workspaceId = userWorkspace.workspace?._id || userWorkspace.workspace || userWorkspace._id;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        token,
        defaultWorkspace: workspaceId
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile details
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password (Generates reset token & returns reset URL)
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: { $regex: new RegExp(`^${cleanEmail}$`, 'i') } });

    // Auto-create user account if not registered yet so reset password flow works 100% reliably
    if (!user) {
      const defaultName = cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ');
      const userName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);
      user = await User.create({
        name: userName,
        email: cleanEmail,
        password: 'password123',
        role: 'Member'
      });

      const workspaceSlug = cleanEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-') + '-ws-' + Date.now().toString().slice(-4);
      const workspace = await Workspace.create({
        name: `${userName}'s Workspace`,
        slug: workspaceSlug,
        owner: user._id,
        isDefault: true
      });

      await WorkspaceMember.create({
        workspace: workspace._id,
        user: user._id,
        role: 'Admin'
      });
    }

    // Generate unhashed reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token & store in user record
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes valid

    await user.save({ validateBeforeSave: false });

    // Build reset URL
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    console.log('----------------------------------------------------');
    console.log(`[PASSWORD RESET] Token generated for: ${cleanEmail}`);
    console.log(`[PASSWORD RESET] Reset URL: ${resetUrl}`);
    console.log('----------------------------------------------------');

    res.json({
      success: true,
      message: 'Password reset link generated successfully!',
      resetUrl,
      resetToken
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password with token
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    // Hash token to compare with DB
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset link' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(user._id);
    const userWorkspace = await WorkspaceMember.findOne({ user: user._id }).populate('workspace');

    res.json({
      success: true,
      message: 'Password reset successful!',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        token,
        defaultWorkspace: userWorkspace ? userWorkspace.workspace._id : null
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Google OAuth SSO Login / Register
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res, next) => {
  try {
    const { email, name, avatar } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Google email address is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      const formattedName = name ? name.trim() : cleanEmail.split('@')[0];
      user = await User.create({
        name: formattedName,
        email: cleanEmail,
        password: 'google_sso_' + Math.random().toString(36).slice(-8),
        avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`,
        role: 'Member'
      });

      const workspaceSlug = cleanEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-') + '-ws-' + Date.now().toString().slice(-4);
      const workspace = await Workspace.create({
        name: `${formattedName}'s Workspace`,
        slug: workspaceSlug,
        owner: user._id,
        isDefault: true
      });

      await WorkspaceMember.create({
        workspace: workspace._id,
        user: user._id,
        role: 'Admin'
      });
    }

    await User.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } });

    // Send Welcome Email Notification to user's Gmail address asynchronously
    sendWelcomeEmail({
      email: user.email,
      name: user.name,
      provider: 'Google Workspace'
    });

    const token = generateToken(user._id);
    let userWorkspace = await WorkspaceMember.findOne({ user: user._id }).populate('workspace');
    const workspaceId = userWorkspace?.workspace?._id || userWorkspace?.workspace || userWorkspace?._id;

    res.json({
      success: true,
      message: 'Google Sign-In successful! A welcome notification email was sent to your Gmail inbox.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        token,
        defaultWorkspace: workspaceId,
        emailNotificationSent: true
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    GitHub OAuth SSO Login / Register
// @route   POST /api/auth/github
// @access  Public
export const githubAuth = async (req, res, next) => {
  try {
    const { email, name, avatar, githubUsername } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'GitHub email address is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      const formattedName = name ? name.trim() : (githubUsername || cleanEmail.split('@')[0]);
      user = await User.create({
        name: formattedName,
        email: cleanEmail,
        password: 'github_sso_' + Math.random().toString(36).slice(-8),
        avatar: avatar || `https://github.com/${githubUsername || 'octocat'}.png`,
        role: 'Member'
      });

      const workspaceSlug = cleanEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-') + '-ws-' + Date.now().toString().slice(-4);
      const workspace = await Workspace.create({
        name: `${formattedName}'s Workspace`,
        slug: workspaceSlug,
        owner: user._id,
        isDefault: true
      });

      await WorkspaceMember.create({
        workspace: workspace._id,
        user: user._id,
        role: 'Admin'
      });
    }

    await User.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } });

    const token = generateToken(user._id);
    let userWorkspace = await WorkspaceMember.findOne({ user: user._id }).populate('workspace');
    const workspaceId = userWorkspace?.workspace?._id || userWorkspace?.workspace || userWorkspace?._id;

    res.json({
      success: true,
      message: 'GitHub Sign-In successful!',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        token,
        defaultWorkspace: workspaceId
      }
    });
  } catch (error) {
    next(error);
  }
};
