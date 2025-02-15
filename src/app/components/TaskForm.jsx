import React from "react";

const TaskForm = ({ taskData, setTaskData, loading }) => {
  return (
    <div>
      <div className="mb-4">
        <label className="block text-gray-700">Title</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={taskData.title}
          onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Description</label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md"
          value={taskData.description}
          onChange={(e) =>
            setTaskData({ ...taskData, description: e.target.value })
          }
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Due Date</label>
        <input
          type="date"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={taskData.due_date}
          onChange={(e) =>
            setTaskData({ ...taskData, due_date: e.target.value })
          }
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Assigned User</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md"
          value={taskData.assigned_user}
          onChange={(e) =>
            setTaskData({ ...taskData, assigned_user: e.target.value })
          }
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Status</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md"
          value={taskData.status}
          onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <button
        type="button"
        onClick={() => {}}
        className={`bg-blue-500 text-white p-3 rounded-md ${
          loading ? "opacity-50" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

export default TaskForm;
