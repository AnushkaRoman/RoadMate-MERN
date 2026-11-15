
import React, { useEffect, useState } from "react";
import api from "../services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("roadmateToken");

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.users);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Activate or deactivate user
  const toggleStatus = async (user) => {
    try {
      setMessage("");
      setError("");

      const response = await api.patch(
        `/admin/users/${user._id}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update user status");
    }
  };

  // Delete user
  const deleteUser = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );

    if (!confirmed) return;

    try {
      setMessage("");
      setError("");

      const response = await api.delete(`/admin/users/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data.message);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete user");
    }
  };

  // Search users
  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email} ${user.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Manage Users</h2>
          <p className="text-muted mb-0">
            Activate, deactivate and manage registered accounts.
          </p>
        </div>

        <button className="btn btn-outline-primary" onClick={fetchUsers}>
          Refresh
        </button>
      </div>

      {message && (
        <div className="alert alert-success alert-dismissible">
          {message}
          <button
            className="btn-close"
            onClick={() => setMessage("")}
          ></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible">
          {error}
          <button
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, email or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-md-7 text-md-end mt-2 mt-md-0">
              <span className="badge bg-primary fs-6">
                Total Users: {users.length}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
              <p className="mt-2">Loading users...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td>
                        <td className="fw-semibold">{user.name}</td>
                        <td>{user.email}</td>

                        <td>
                          <span className="badge bg-secondary">
                            {user.role}
                          </span>
                        </td>

                        <td>
                          {user.isActive === false ? (
                            <span className="badge bg-danger">
                              Inactive
                            </span>
                          ) : (
                            <span className="badge bg-success">
                              Active
                            </span>
                          )}
                        </td>

                        <td>
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "-"}
                        </td>

                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className={`btn btn-sm ${
                                user.isActive === false
                                  ? "btn-success"
                                  : "btn-warning"
                              }`}
                              onClick={() => toggleStatus(user)}
                            >
                              {user.isActive === false
                                ? "Activate"
                                : "Deactivate"}
                            </button>

                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteUser(user)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
