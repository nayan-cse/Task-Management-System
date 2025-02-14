"use client";
import React, { useState, useEffect } from "react";
import LogoutButton from "../components/logout/page";
import { useRouter } from "next/navigation";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    due_date: "",
    assigned_user: "",
    status: "Pending",
  });
  const [loading, setLoading] = useState(false);

  // Fetch tasks from the API
  const fetchTasks = async () => {
    const token = localStorage.getItem("accessToken");

    const res = await fetch("/api/v1/tasks", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.status === 401) {
      router.push("/login");
    } else if (res.status === 200) {
      setTasks(data.tasks || []);
    } else {
      alert(data.error || "Something went wrong while fetching tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async () => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    const res = await fetch("/api/v1/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    });
    const data = await res.json();
    setLoading(false);
    if (res.status === 200) {
      setTaskData({
        title: "",
        description: "",
        due_date: "",
        assigned_user: "",
        status: "Pending",
      });
      setShowModal(false);
      fetchTasks(); // Fetch tasks after creating a new one
    } else {
      alert(data.error || "Something went wrong!");
    }
  };

  const handleUpdateTask = async () => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`/api/v1/tasks/${selectedTask.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    });
    const data = await res.json();
    setLoading(false);
    if (res.status === 200) {
      setSelectedTask(null);
      setTaskData({
        title: "",
        description: "",
        due_date: "",
        assigned_user: "",
        status: "Pending",
      });
      setShowModal(false);
      fetchTasks(); // Fetch tasks after updating one
    } else {
      alert(data.error || "Something went wrong!");
    }
  };

  const handleDeleteTask = async (id) => {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`/api/v1/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (res.status === 200) {
      fetchTasks(); // Fetch tasks after deleting one
    } else {
      alert(data.error || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 transition-all duration-300 hover:text-blue-600">
          Task Management
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white p-3 rounded-md shadow-md hover:bg-blue-600 transition-all duration-300"
        >
          Create New Task
        </button>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {task.title}
            </h2>
            <p className="text-gray-600 mt-2">{task.description}</p>
            <p className="text-gray-500 mt-2">
              Due: {new Date(task.due_date).toLocaleString()}
            </p>
            <p className="text-gray-500 mt-2">
              Assigned to: {task.assigned_user}
            </p>
            <p className="text-gray-500 mt-2">Status: {task.status}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setSelectedTask(task);
                  setTaskData({
                    title: task.title,
                    description: task.description,
                    due_date: task.due_date,
                    assigned_user: task.assigned_user,
                    status: task.status,
                  });
                  setShowModal(true);
                }}
                className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition-all duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="bg-red-500 text-white p-2 ml-2 rounded-md hover:bg-red-600 transition-all duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 transition-all duration-300">
          <div className="bg-white p-6 rounded-lg w-96 transform transition-all duration-500 ease-in-out">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {selectedTask ? "Edit Task" : "Create Task"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                selectedTask ? handleUpdateTask() : handleCreateTask();
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={taskData.title}
                  onChange={(e) =>
                    setTaskData({ ...taskData, title: e.target.value })
                  }
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  value={taskData.description}
                  onChange={(e) =>
                    setTaskData({ ...taskData, description: e.target.value })
                  }
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  value={taskData.due_date}
                  onChange={(e) =>
                    setTaskData({ ...taskData, due_date: e.target.value })
                  }
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Assigned User
                </label>
                <input
                  type="text"
                  value={taskData.assigned_user}
                  onChange={(e) =>
                    setTaskData({ ...taskData, assigned_user: e.target.value })
                  }
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Status
                </label>
                <select
                  value={taskData.status}
                  onChange={(e) =>
                    setTaskData({ ...taskData, status: e.target.value })
                  }
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`bg-blue-500 text-white p-3 rounded-md ${
                    loading ? "opacity-50" : ""
                  }`}
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : selectedTask
                    ? "Update Task"
                    : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
