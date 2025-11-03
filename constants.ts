
import { Issue, Translations, UserRole } from './types';

export const MOCK_ISSUES: Issue[] = [
    {
      id: 'JH001',
      title: 'Large Pothole on Main Road',
      description: 'A very dangerous pothole has formed near the city hospital entrance, causing traffic jams and potential accidents.',
      category: 'Roads & Potholes',
      status: 'In Progress',
      priority: 'High',
      location: { lat: 23.3441, lng: 85.3096, address: 'Main Road, Ranchi' },
      imageUrl: 'https://picsum.photos/seed/pothole/600/400',
      submittedBy: 'Amit Kumar',
      submittedDate: '2024-07-20T10:00:00Z',
      lastUpdated: '2024-07-22T14:30:00Z',
      assignedTo: 'Roads Department',
      upvotes: 128,
    },
    {
      id: 'JH002',
      title: 'Streetlight Not Working',
      description: 'The streetlight in Sector 4, Lane 5 has been out for over a week, making the area unsafe at night.',
      category: 'Street Lights',
      status: 'Acknowledged',
      priority: 'Medium',
      location: { lat: 23.3500, lng: 85.3200, address: 'Sector 4, HEC Township' },
      submittedBy: 'Priya Sharma',
      submittedDate: '2024-07-18T19:45:00Z',
      lastUpdated: '2024-07-19T11:00:00Z',
      assignedTo: 'Electricity Department',
      upvotes: 45,
    },
    {
      id: 'JH003',
      title: 'Garbage Overflowing',
      description: 'The community dustbin at the market square has not been cleared for days and is overflowing, causing a foul smell.',
      category: 'Garbage & Waste Disposal',
      status: 'Resolved',
      priority: 'High',
      location: { lat: 23.3456, lng: 85.3123, address: 'Market Square, Doranda' },
      imageUrl: 'https://picsum.photos/seed/garbage/600/400',
      submittedBy: 'Rajesh Singh',
      submittedDate: '2024-07-15T08:00:00Z',
      lastUpdated: '2024-07-16T17:00:00Z',
      assignedTo: 'Sanitation Department',
      upvotes: 210,
    },
     {
      id: 'JH004',
      title: 'Water Pipe Leakage',
      description: 'There is a major water pipe leakage on Kanke Road. A lot of clean water is being wasted.',
      category: 'Water Supply & Leakage',
      status: 'Submitted',
      priority: 'High',
      location: { lat: 23.3841, lng: 85.3196, address: 'Kanke Road, Ranchi' },
      imageUrl: 'https://picsum.photos/seed/water/600/400',
      submittedBy: 'Sunita Devi',
      submittedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      upvotes: 15,
    }
  ];

export const USER_ROLES: Record<UserRole, { name: string }> = {
    citizen: {
        name: 'Demo Citizen'
    },
    admin: {
        name: 'Admin Officer'
    }
};

export const T: Translations = {
    // General
    jharkhand_civic_connect: { en: 'Jharkhand Civic Connect', hi: 'झारखंड सिविक कनेक्ट' },
    dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड' },
    report_issue: { en: 'Report Issue', hi: 'समस्या की रिपोर्ट करें' },
    track_reports: { en: 'Track Reports', hi: 'रिपोर्ट ट्रैक करें' },
    admin_panel: { en: 'Admin Panel', hi: 'एडमिन पैनल' },
    logout: { en: 'Logout', hi: 'लॉग आउट' },
    
    // Login
    login_citizen: { en: 'Citizen Login', hi: 'नागरिक लॉगिन' },
    login_admin: { en: 'Admin Login', hi: 'एडमिन लॉगिन' },
    phone_number: { en: 'Phone Number', hi: 'फ़ोन नंबर' },
    password: { en: 'Password', hi: 'पासवर्ड' },
    login: { en: 'Login', hi: 'लॉग इन करें' },
    
    // Report Issue
    new_issue_report: { en: 'New Issue Report', hi: 'नई समस्या रिपोर्ट' },
    describe_issue: { en: 'Describe your issue...', hi: 'अपनी समस्या का वर्णन करें...' },
    use_voice: { en: 'Use Voice', hi: 'आवाज का प्रयोग करें' },
    listening: { en: 'Listening...', hi: 'सुन रहा है...' },
    upload_photo: { en: 'Upload Photo', hi: 'तस्वीर डालिये' },
    get_location: { en: 'Get Location', hi: 'स्थान प्राप्त करें' },
    getting_location: { en: 'Getting location...', hi: 'स्थान प्राप्त हो रहा है...' },
    submit_report: { en: 'Submit Report', hi: 'रिपोर्ट सबमिट करें' },
    submitting: { en: 'Submitting...', hi: 'सबमिट कर रहा है...' },
    ai_analysis: { en: 'AI Analysis', hi: 'एआई विश्लेषण' },
    suggested_category: { en: 'Suggested Category', hi: 'सुझाई गई श्रेणी' },
    suggested_priority: { en: 'Suggested Priority', hi: 'सुझाई गई प्राथमिकता' },
    enhanced_description: { en: 'Enhanced Description', hi: 'विस्तृत विवरण' },
    
    // Track Issues
    my_reported_issues: { en: 'My Reported Issues', hi: 'मेरे द्वारा रिपोर्ट की गई समस्याएं' },
    status: { en: 'Status', hi: 'स्थिति' },
    category: { en: 'Category', hi: 'श्रेणी' },
    priority: { en: 'Priority', hi: 'प्राथमिकता' },

    // Admin
    welcome_admin: { en: 'Welcome, Admin', hi: 'स्वागत है, एडमिन' },
    overview: { en: 'Overview', hi: 'अवलोकन' },
    total_issues: { en: 'Total Issues', hi: 'कुल समस्याएं' },
    resolved: { en: 'Resolved', hi: 'समाधान' },
    pending: { en: 'Pending', hi: 'लंबित' },
    high_priority: { en: 'High Priority', hi: 'उच्च प्राथमिकता' },
    issue_by_category: { en: 'Issues by Category', hi: 'श्रेणी के अनुसार समस्याएं' },
    resolution_time: { en: 'Average Resolution Time (Days)', hi: 'औसत समाधान समय (दिन)' },
    manage_issues: { en: 'Manage Issues', hi: 'समस्याओं का प्रबंधन करें' },
    map_view: { en: 'Map View', hi: 'मानचित्र दृश्य' },
    generate_reports: { en: 'Generate Reports', hi: 'रिपोर्ट तैयार करें' },
};