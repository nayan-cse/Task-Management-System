import React from "react";

const TaskModal = ({
  taskData,
  setTaskData,
  loading,
  setShowModal,
  handleCreateTask,
  handleUpdateTask,
  selectedTask,
}) => {
  return (
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
  );
};

export default TaskModal;
