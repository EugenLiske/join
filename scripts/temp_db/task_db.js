let currentUser = {
  "name": "Lala Kufmenk",
  "email": "lala.kufmenk@yahoo.de",
  "password": "123Test",
  "initials": "LK",
  "color": "#a3d25f",
  "role": "user"
};

let currentTask = null;
let currentTaskKey = "";

let nextTaskId = 0;

const categories = ["User Story", "Technical Task"];

let tasks = {
  "task_0": {
    "title": "Task Title 1",
    "description": "This is the description of Task 0",
    "dueDate": "05-09-2025",
    "priority": "medium",
    "assignedTo": {
      "contact_0": 3,
      "contact_1": 5
    },
    "category": "User Story",
    "column": 1,
    "subtasks": {
      "subtask_0": { "description": "This is Subtask 1", "status": false },
      "subtask_1": { "description": "This is Subtask 3", "status": false }
    }
  },
  "task_1": {
    "title": "Task Title 2",
    "description": "This is the description of Task 1",
    "dueDate": "10-09-2025",
    "priority": "high",
    "assignedTo": {
      "contact_2": 7
    },
    "category": "Technical Task",
    "column": 2,
    "subtasks": {
      "subtask_0": { "description": "Fix login issue", "status": false },
      "subtask_1": { "description": "Write test cases", "status": true }
    }
  },
  "task_2": {
    "title": "Task Title 3",
    "description": "This is the description of Task 2",
    "dueDate": "12-09-2025",
    "priority": "low",
    "assignedTo": {
      "contact_3": 2
    },
    "category": "Refactor",
    "column": 1,
    "subtasks": {
      "subtask_0": { "description": "Cleanup CSS", "status": false },
      "subtask_1": { "description": "Remove unused variables", "status": false }
    }
  },
  "task_3": {
    "title": "Task Title 4",
    "description": "This is the description of Task 3",
    "dueDate": "15-09-2025",
    "priority": "medium",
    "assignedTo": {
      "contact_0": 1,
      "contact_4": 4
    },
    "category": "Feature",
    "column": 3,
    "subtasks": {
      "subtask_0": { "description": "Design UI", "status": false },
      "subtask_1": { "description": "Implement frontend", "status": false }
    }
  },
  "task_4": {
    "title": "Task Title 5",
    "description": "This is the description of Task 4",
    "dueDate": "18-09-2025",
    "priority": "high",
    "assignedTo": {
      "contact_2": 6
    },
    "category": "User Story",
    "column": 2,
    "subtasks": {
      "subtask_0": { "description": "Write acceptance criteria", "status": false },
      "subtask_1": { "description": "Get stakeholder approval", "status": false }
    }
  },
  "task_5": {
    "title": "Task Title 6",
    "description": "This is the description of Task 5",
    "dueDate": "20-09-2025",
    "priority": "low",
    "assignedTo": {
      "contact_5": 9
    },
    "category": "Chore",
    "column": 1,
    "subtasks": {
      "subtask_0": { "description": "Update documentation", "status": false },
      "subtask_1": { "description": "Review with team", "status": false }
    }
  },
  "task_6": {
    "title": "Task Title 7",
    "description": "This is the description of Task 6",
    "dueDate": "25-09-2025",
    "priority": "medium",
    "assignedTo": {
      "contact_1": 5,
      "contact_6": 8
    },
    "category": "Maintenance",
    "column": 3,
    "subtasks": {
      "subtask_0": { "description": "Check server logs", "status": false },
      "subtask_1": { "description": "Restart services", "status": false }
    }
  }
};