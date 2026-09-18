import React, { createContext, useContext, useState, useEffect } from 'react';

const CivicDataContext = createContext();

// Seed coordinates around Nirma University / SG Highway, Ahmedabad for authentic demo
export const DEMO_CENTER = { lat: 23.1287, lng: 72.5446 };

export const SEEDED_CLUSTERS = [
  {
    id: 101,
    issueType: 'POTHOLE',
    department: 'ROAD',
    severity: 8,
    centroidLat: 23.1295,
    centroidLng: 72.5452,
    nearestEdgeId: 'edge_sg_highway_01',
    status: 'REPORTED',
    priorityScore: 28.8, // 8 * 2 reports * 1.0 recency * 1.8 centrality
    reportCount: 3,
    assignedWorkerId: null,
    assignedWorkerName: null,
    firstReportedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    lastReportedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    description: 'Deep hazardous pothole near main university campus gate, traffic slowing severely.',
    targetDays: 7,
    daysOpen: 1,
    aiConfidence: 0.94
  },
  {
    id: 102,
    issueType: 'WATER',
    department: 'WATER',
    severity: 7,
    centroidLat: 23.1270,
    centroidLng: 72.5420,
    nearestEdgeId: 'edge_nirma_rd_04',
    status: 'ASSIGNED',
    priorityScore: 21.0,
    reportCount: 2,
    assignedWorkerId: 3,
    assignedWorkerName: 'Amit Patel (Water Dept)',
    firstReportedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    lastReportedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80',
    description: 'Pipeline rupture causing waterlogging on access road.',
    targetDays: 2,
    daysOpen: 1,
    aiConfidence: 0.91
  },
  {
    id: 103,
    issueType: 'STREETLIGHT',
    department: 'ELECTRICAL',
    severity: 5,
    centroidLat: 23.1310,
    centroidLng: 72.5470,
    nearestEdgeId: 'edge_sg_service_09',
    status: 'IN_PROGRESS',
    priorityScore: 12.5,
    reportCount: 1,
    assignedWorkerId: 2,
    assignedWorkerName: 'Sunita Devi (Electrical)',
    firstReportedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    lastReportedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    photoUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&q=80',
    description: 'Streetlight pole dark for 200m stretch near residential junction.',
    targetDays: 3,
    daysOpen: 2,
    aiConfidence: 0.88
  },
  {
    id: 104,
    issueType: 'GARBAGE',
    department: 'SANITATION',
    severity: 4,
    centroidLat: 23.1250,
    centroidLng: 72.5490,
    nearestEdgeId: 'edge_inner_lane_02',
    status: 'RESOLVED',
    priorityScore: 6.2,
    reportCount: 1,
    assignedWorkerId: 4,
    assignedWorkerName: 'Ramesh Shah (Sanitation)',
    firstReportedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    lastReportedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    resolvedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    photoUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    description: 'Overflowing dump bin near market quadrant.',
    targetDays: 2,
    daysOpen: 3,
    aiConfidence: 0.96
  }
];

export const SEEDED_WORKERS = [
  { id: 1, name: 'Raj Kumar', department: 'ROAD', currentLat: 23.1290, currentLng: 72.5440, activeTaskCount: 1, phone: '+91 98765 43210' },
  { id: 2, name: 'Sunita Devi', department: 'ELECTRICAL', currentLat: 23.1315, currentLng: 72.5465, activeTaskCount: 1, phone: '+91 98765 43211' },
  { id: 3, name: 'Amit Patel', department: 'WATER', currentLat: 23.1265, currentLng: 72.5415, activeTaskCount: 1, phone: '+91 98765 43212' },
  { id: 4, name: 'Ramesh Shah', department: 'SANITATION', currentLat: 23.1255, currentLng: 72.5485, activeTaskCount: 0, phone: '+91 98765 43213' },
];

export function CivicDataProvider({ children }) {
  const [clusters, setClusters] = useState(SEEDED_CLUSTERS);
  const [workers, setWorkers] = useState(SEEDED_WORKERS);
  const [userRole, setUserRole] = useState('CITIZEN'); // CITIZEN | AUTHORITY | WORKER
  const [activeTab, setActiveTab] = useState('report');
  
  // Citizen Trust & Rewards
  const [citizenProfile, setCitizenProfile] = useState({
    name: 'Vansh Hala',
    email: 'vansh@nirmauni.ac.in',
    trustScore: 1.0,
    rewardPoints: 145,
    rank: 'Civic Guardian (Tier 2)',
    totalSubmitted: 4,
    verifiedCount: 3,
  });

  const [myReports, setMyReports] = useState([
    {
      id: 4821,
      clusterId: 101,
      issueType: 'POTHOLE',
      status: 'REPORTED',
      description: 'Deep hazardous pothole near main university campus gate',
      createdAt: new Date(Date.now() - 3600000 * 4).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
      mergedCount: 3
    }
  ]);

  // Weather Predictive Alert (Monsoon Hazard)
  const [weatherAlert, setWeatherAlert] = useState({
    active: true,
    title: 'Monsoon Heavy Rainfall & Drainage Alert',
    message: 'Open-Meteo forecast: 55mm/24h expected in Ward 4. 2 active waterlogging/drainage issues flagged. Exercise caution.',
    severity: 'HIGH'
  });

  // Haversine distance in meters
  const calculateDistanceMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Submit Report with automatic duplicate detection (< 50 meters, same issue type)
  const submitReport = async ({ photoUrl, description, issueType, lat, lng }) => {
    // AI Classification keyword fallback simulator if issueType empty
    let detectedType = issueType;
    let detectedDepartment = 'ROAD';
    let severity = 7;

    const descLower = (description || '').toLowerCase();
    if (descLower.includes('water') || descLower.includes('pipe') || descLower.includes('leak')) {
      detectedType = 'WATER';
      detectedDepartment = 'WATER';
      severity = 7;
    } else if (descLower.includes('light') || descLower.includes('dark') || descLower.includes('wire')) {
      detectedType = 'STREETLIGHT';
      detectedDepartment = 'ELECTRICAL';
      severity = 5;
    } else if (descLower.includes('garbage') || descLower.includes('trash') || descLower.includes('dump')) {
      detectedType = 'GARBAGE';
      detectedDepartment = 'SANITATION';
      severity = 4;
    } else if (descLower.includes('pothole') || descLower.includes('road') || descLower.includes('crack')) {
      detectedType = 'POTHOLE';
      detectedDepartment = 'ROAD';
      severity = 8;
    }

    // Check for nearby matching open cluster within 50m
    const existingClusterIndex = clusters.findIndex(c => 
      c.issueType === detectedType &&
      c.status !== 'RESOLVED' &&
      calculateDistanceMeters(c.centroidLat, c.centroidLng, lat, lng) <= 50
    );

    let resultClusterId = null;
    let isMerged = false;
    let newReportCount = 1;

    if (existingClusterIndex !== -1) {
      // Merge into existing cluster
      isMerged = true;
      const updatedClusters = [...clusters];
      const target = { ...updatedClusters[existingClusterIndex] };
      newReportCount = target.reportCount + 1;
      target.reportCount = newReportCount;
      // Recompute running centroid
      target.centroidLat = (target.centroidLat * (newReportCount - 1) + lat) / newReportCount;
      target.centroidLng = (target.centroidLng * (newReportCount - 1) + lng) / newReportCount;
      // Recompute priority score: severity * cluster_size * recency * criticality
      target.priorityScore = parseFloat((target.severity * newReportCount * 1.0 * 1.5).toFixed(1));
      target.lastReportedAt = new Date().toISOString();
      updatedClusters[existingClusterIndex] = target;
      setClusters(updatedClusters);
      resultClusterId = target.id;
    } else {
      // Create new cluster
      const newId = 100 + clusters.length + 1;
      resultClusterId = newId;
      const newCluster = {
        id: newId,
        issueType: detectedType,
        department: detectedDepartment,
        severity: severity,
        centroidLat: lat,
        centroidLng: lng,
        nearestEdgeId: `edge_custom_${newId}`,
        status: 'REPORTED',
        priorityScore: parseFloat((severity * 1 * 1.0 * 1.2).toFixed(1)),
        reportCount: 1,
        assignedWorkerId: null,
        assignedWorkerName: null,
        firstReportedAt: new Date().toISOString(),
        lastReportedAt: new Date().toISOString(),
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
        description: description || 'Civic issue report captured via citizen portal.',
        targetDays: 3,
        daysOpen: 0,
        aiConfidence: 0.92
      };
      setClusters([newCluster, ...clusters]);
    }

    // Add to My Reports timeline
    const newReportItem = {
      id: Date.now(),
      clusterId: resultClusterId,
      issueType: detectedType,
      status: 'REPORTED',
      description: description || 'Reported civic issue',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
      mergedCount: newReportCount
    };
    setMyReports([newReportItem, ...myReports]);

    // Reward points for citizen
    setCitizenProfile(prev => ({
      ...prev,
      rewardPoints: prev.rewardPoints + 15,
      totalSubmitted: prev.totalSubmitted + 1
    }));

    return {
      mergedIntoExistingCluster: isMerged,
      clusterId: resultClusterId,
      clusterReportCount: newReportCount,
      issueType: detectedType,
      severity
    };
  };

  // Authority Actions
  const verifyCluster = (id, newType, newSeverity, newDept) => {
    setClusters(clusters.map(c => {
      if (c.id === id) {
        const priority = parseFloat((newSeverity * c.reportCount * 1.0 * 1.5).toFixed(1));
        return {
          ...c,
          issueType: newType || c.issueType,
          severity: newSeverity || c.severity,
          department: newDept || c.department,
          status: c.status === 'REPORTED' ? 'VERIFIED' : c.status,
          priorityScore: priority
        };
      }
      return c;
    }));
  };

  const overridePriority = (id, newScore) => {
    setClusters(clusters.map(c => c.id === id ? { ...c, priorityScore: parseFloat(newScore) } : c));
  };

  const assignWorkerToCluster = (clusterId, workerId) => {
    const worker = workers.find(w => w.id === workerId);
    if (!worker) return;

    setClusters(clusters.map(c => {
      if (c.id === clusterId) {
        return {
          ...c,
          assignedWorkerId: worker.id,
          assignedWorkerName: `${worker.name} (${worker.department})`,
          status: 'ASSIGNED'
        };
      }
      return c;
    }));

    // Update worker active workload
    setWorkers(workers.map(w => w.id === workerId ? { ...w, activeTaskCount: w.activeTaskCount + 1 } : w));
  };

  // Worker Resolution Action
  const resolveCluster = (clusterId, workerId, afterPhotoUrl, notes) => {
    setClusters(clusters.map(c => {
      if (c.id === clusterId) {
        return {
          ...c,
          status: 'RESOLVED',
          resolvedAt: new Date().toISOString(),
          afterPhotoUrl: afterPhotoUrl || 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80',
          resolutionNotes: notes || 'Issue verified and repaired on site.'
        };
      }
      return c;
    }));

    if (workerId) {
      setWorkers(workers.map(w => w.id === workerId ? { ...w, activeTaskCount: Math.max(0, w.activeTaskCount - 1) } : w));
    }
  };

  // Auto Worker Ranking Algorithm
  const suggestWorkers = (clusterId) => {
    const cluster = clusters.find(c => c.id === clusterId);
    if (!cluster) return [];

    return workers.map(w => {
      const isDomainMatch = w.department === cluster.department;
      const distKm = calculateDistanceMeters(cluster.centroidLat, cluster.centroidLng, w.currentLat, w.currentLng) / 1000.0;
      // Formula: (domainMatch ? 1 : 0) * priorityWeight * (1 / (1 + distanceKm)) * (1 / (1 + activeTaskCount))
      const matchMultiplier = isDomainMatch ? 1.0 : 0.2;
      const distanceFactor = 1.0 / (1.0 + distKm);
      const workloadFactor = 1.0 / (1.0 + w.activeTaskCount);
      const fitScore = parseFloat((matchMultiplier * cluster.priorityScore * distanceFactor * workloadFactor).toFixed(2));

      return {
        workerId: w.id,
        name: w.name,
        department: w.department,
        distanceKm: parseFloat(distKm.toFixed(2)),
        activeTasks: w.activeTaskCount,
        fitScore: fitScore,
        isRecommended: isDomainMatch && w.activeTaskCount < 2
      };
    }).sort((a, b) => b.fitScore - a.fitScore);
  };

  return (
    <CivicDataContext.Provider value={{
      clusters,
      workers,
      userRole,
      setUserRole,
      activeTab,
      setActiveTab,
      citizenProfile,
      myReports,
      weatherAlert,
      submitReport,
      verifyCluster,
      overridePriority,
      assignWorkerToCluster,
      resolveCluster,
      suggestWorkers
    }}>
      {children}
    </CivicDataContext.Provider>
  );
}

export const useCivicData = () => useContext(CivicDataContext);
