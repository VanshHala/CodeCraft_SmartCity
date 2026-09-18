export const currentUser = {
  id: "JD",
  name: "Jordan Davis",
  role: "citizen" // 'citizen' or 'authority'
};

export const recentReports = [
  {
    id: "SC1024",
    type: "Pothole",
    location: "125 W 42nd Street",
    priority: "High",
    status: "In Progress",
    reported: "2 hours ago",
    department: "Road & Infrastructure",
    description: "A section of road surface is damaged and creating an uneven path for vehicles and cyclists.",
    coords: [40.755, -73.986]
  },
  {
    id: "SC1023",
    type: "Broken streetlight",
    location: "8th Avenue & 31st",
    priority: "Medium",
    status: "Assigned",
    reported: "5 hours ago",
    department: "Public Lighting",
    coords: [40.750, -73.993]
  },
  {
    id: "SC1022",
    type: "Waste collection",
    location: "Hudson Square",
    priority: "Low",
    status: "Verified",
    reported: "Yesterday",
    department: "Sanitation",
    coords: [40.726, -74.006]
  },
  {
    id: "SC1021",
    type: "Drainage problem",
    location: "East 14th Street",
    priority: "High",
    status: "Resolved",
    reported: "2 days ago",
    department: "Water & Drainage",
    coords: [40.733, -73.986]
  }
];

export const authorityStats = {
  totalIssues: 1284,
  pending: 241,
  inProgress: 156,
  resolved: 887
};

export const citizenStats = {
  submitted: 24,
  inProgress: 7,
  resolved: 17,
  nearby: 12
};
