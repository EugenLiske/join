let currentUser = {
  "name": "Lala Kufmenk",
  "email": "lala.kufmenk@yahoo.de",
  "password": "123Test",
  "initials": "LK",
  "color": "#a3d25f",
  "role": "user"
};


let tasks = [
  {
    "title": "Design fertigstellen",
    "description": "mache 1, mache 2",
    "dueDate": "2025-10-22",
    "priority": "medium",
    "assignedTo": "Hans Peter",
    "category": "Design",
    "status": 1,
    "subtasks": [
      {
        "description": "Layout finalisieren",
        "status": false
      },
      {
        "description": "Farbschema prüfen",
        "status": true
      }
    ]
  },
  {
    "title": "API entwickeln",
    "description": "Endpoints definieren, testen",
    "dueDate": "2025-09-15",
    "priority": "urgent",
    "assignedTo": "Anna Müller",
    "category": "Entwicklung",
    "status": 2,
    "subtasks": [
      {
        "description": "GET-/POST-Routen erstellen",
        "status": false
      }
    ]
  },
  {
    "title": "Dokumentation schreiben",
    "description": "README und technische Beschreibung",
    "dueDate": "2025-11-05",
    "priority": "low",
    "assignedTo": "Tom Schneider",
    "category": "Dokumentation",
    "status": 0,
    "subtasks": [
      {
        "description": "README.md erstellen",
        "status": true
      },
      {
        "description": "API-Dokumentation ergänzen",
        "status": false
      }
    ]
  },
  {
    "title": "Testfälle schreiben",
    "description": "Unit- und Integrationstests",
    "dueDate": "2025-10-01",
    "priority": "medium",
    "assignedTo": "Lea König",
    "category": "Testing",
    "status": 3,
    "subtasks": [
      {
        "description": "Unit Tests für Modul A",
        "status": true
      },
      {
        "description": "Integrationstests vorbereiten",
        "status": false
      }
    ]
  },
  {
    "title": "Projektbesprechung vorbereiten",
    "description": "Agenda und Präsentation erstellen",
    "dueDate": "2025-08-28",
    "priority": "urgent",
    "assignedTo": "Max Fischer",
    "category": "Management",
    "status": 1,
    "subtasks": [
      {
        "description": "PowerPoint erstellen",
        "status": true
      },
      {
        "description": "Agenda abstimmen",
        "status": false
      }
    ]
  },
  {
    "title": "Projektbesprechung vorbereiten",
    "description": "Agenda und Präsentation erstellen",
    "dueDate": "2025-08-28",
    "priority": "urgent",
    "assignedTo": "Max Fischer",
    "category": "Management",
    "status": 1,
    "subtasks": [
      {
        "description": "PowerPoint erstellen",
        "status": true
      },
      {
        "description": "Agenda abstimmen",
        "status": false
      }
    ]
  }
];