import React, { createContext, useContext, useState, useEffect } from 'react';
import { workspaceService } from '../services/workspaceService';
import { useAuth } from './AuthContext';

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [workspaceRole, setWorkspaceRole] = useState('Member');
  const [loading, setLoading] = useState(true);

  const fetchWorkspaces = async () => {
    if (!user) {
      setWorkspaces([]);
      setActiveWorkspace(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await workspaceService.getWorkspaces();
      let list = res.data.map(item => ({
        ...item.workspace,
        role: item.role
      }));

      // If user has zero workspaces, auto-create a default personal workspace on the fly
      if (list.length === 0) {
        try {
          const newWs = await workspaceService.createWorkspace({
            name: `${user.name}'s Workspace`,
            description: 'Personal team workspace'
          });
          list = [{ ...newWs.data, role: 'Admin' }];
        } catch (wsErr) {
          console.error('[Auto Create Workspace Error]', wsErr);
        }
      }

      setWorkspaces(list);

      if (list.length > 0) {
        const savedId = localStorage.getItem('activeWorkspaceId');
        const match = list.find(w => w._id === savedId) || list[0];
        setActiveWorkspace(match);
        setWorkspaceRole(match.role || (user.role === 'Admin' ? 'Admin' : 'Member'));
        localStorage.setItem('activeWorkspaceId', match._id);
      } else {
        setActiveWorkspace(null);
      }
    } catch (err) {
      console.error('[Fetch Workspaces Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, [user]);

  const switchWorkspace = (workspaceId) => {
    const target = workspaces.find(w => w._id === workspaceId);
    if (target) {
      setActiveWorkspace(target);
      setWorkspaceRole(target.role || (user?.role === 'Admin' ? 'Admin' : 'Member'));
      localStorage.setItem('activeWorkspaceId', target._id);
    }
  };

  return (
    <WorkspaceContext.Provider value={{
      workspaces,
      activeWorkspace,
      workspaceRole,
      loading,
      switchWorkspace,
      refetchWorkspaces: fetchWorkspaces
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);
