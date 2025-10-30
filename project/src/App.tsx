import type { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Landing } from './pages/Landing';
import { SignUp } from './pages/SignUp';
import { SignIn } from './pages/SignIn';
import { Layout } from './components/Layout';
import { EntrepreneurDashboard } from './pages/dashboards/EntrepreneurDashboard';
import { InvestorDashboard } from './pages/dashboards/InvestorDashboard';
import { DealerDashboard } from './pages/dashboards/DealerDashboard';
import { Community } from './pages/Community';
import { Messages } from './pages/Messages';
import { Events } from './pages/Events';
import { Settings } from './pages/Settings';
import { Admin } from './pages/Admin';
import { MyIdeas } from './pages/MyIdeas';
import { FindInvestors } from './pages/FindInvestors';
import { Opportunities } from './pages/Opportunities';
import { Portfolio } from './pages/Portfolio';
import { MyProducts } from './pages/MyProducts';
import { FindClients } from './pages/FindClients';
import { PostIdea } from './pages/PostIdea';
import { IdeaDetails } from './pages/IdeaDetails';
import { Recommendations } from './pages/Recommendations';
import { Partnerships } from './pages/Partnerships';
import { AddProduct } from './pages/AddProduct';

function PrivateRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/signin" />;
}

function RoleRoute({ roles, children }: { roles: Array<'entrepreneur' | 'investor' | 'dealer' | 'admin'>; children: ReactNode }) {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) return <Navigate to="/signin" />;

  return roles.includes(profile.role) ? <>{children}</> : <Navigate to="/dashboard" />;
}

function DashboardRouter() {
  const { profile } = useAuth();

  if (!profile) return null;

  switch (profile.role) {
    case 'entrepreneur':
      return <EntrepreneurDashboard />;
    case 'investor':
      return <InvestorDashboard />;
    case 'dealer':
      return <DealerDashboard />;
    case 'admin':
      return <Admin />;
    default:
      return <EntrepreneurDashboard />;
  }
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout>
                  <DashboardRouter />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Entrepreneur: post idea (funding request) */}
          <Route
            path="/post-idea"
            element={
              <PrivateRoute>
                <RoleRoute roles={['entrepreneur']}>
                  <Layout>
                    <PostIdea />
                  </Layout>
                </RoleRoute>
              </PrivateRoute>
            }
          />

          {/* Idea details (invest/fund) - accessible to all authenticated roles */}
          <Route
            path="/ideas/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <IdeaDetails />
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Entrepreneur-only pages */}
          <Route
            path="/my-ideas"
            element={
              <PrivateRoute>
                <RoleRoute roles={['entrepreneur']}>
                  <Layout>
                    <MyIdeas />
                  </Layout>
                </RoleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/find-investors"
            element={
              <PrivateRoute>
                <RoleRoute roles={['entrepreneur']}>
                  <Layout>
                    <FindInvestors />
                  </Layout>
                </RoleRoute>
              </PrivateRoute>
            }
          />

          {/* Investor-only pages */}
          <Route
            path="/recommendations"
            element={
              <PrivateRoute>
                <RoleRoute roles={['investor']}>
                  <Layout>
                    <Recommendations />
                  </Layout>
                </RoleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/opportunities"
            element={
              <PrivateRoute>
                <RoleRoute roles={['investor', 'dealer']}>
                  <Layout>
                    <Opportunities />
                  </Layout>
                </RoleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/portfolio"
            element={
              <PrivateRoute>
                <RoleRoute roles={['investor']}>
                  <Layout>
                    <Portfolio />
                  </Layout>
                </RoleRoute>
              </PrivateRoute>
            }
          />

          {/* Dealer-only pages */}
          <Route
            path="/partnerships"
            element={
              <PrivateRoute>
                <RoleRoute roles={['dealer']}>
                  <Layout>
                    <Partnerships />
                  </Layout>
                </RoleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <PrivateRoute>
                <RoleRoute roles={['dealer']}>
                  <Layout>
                    <AddProduct />
                  </Layout>
                </RoleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/my-products"
            element={
              <PrivateRoute>
                <RoleRoute roles={['dealer']}>
                  <Layout>
                    <MyProducts />
                  </Layout>
                </RoleRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/find-clients"
            element={
              <PrivateRoute>
                <RoleRoute roles={['dealer']}>
                  <Layout>
                    <FindClients />
                  </Layout>
                </RoleRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="/community"
            element={
              <PrivateRoute>
                <Layout>
                  <Community />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <PrivateRoute>
                <Layout>
                  <Messages />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/events"
            element={
              <PrivateRoute>
                <Layout>
                  <Events />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Layout>
                  <Settings />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <RoleRoute roles={['admin']}>
                  <Layout>
                    <Admin />
                  </Layout>
                </RoleRoute>
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
