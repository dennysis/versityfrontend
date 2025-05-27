export interface MockOpportunity {
  id: number;
  title: string;
  description: string;
  location: string;
  date_posted: string;
  deadline: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'inactive' | 'completed' | 'draft';
  required_skills: string[];
  time_commitment: string;
  organization_id: number;
  organization?: {
    id: number;
    name: string;
  };
  applications_count?: number;
  volunteers_needed: number;
  volunteers_registered?: number;
}

export interface MockOrganization {
  id: number;
  name: string;
  contact_email?: string;
  description?: string;
  location?: string;
}

export interface MockVolunteer {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  phone?: string;
  location?: string;
  joined_date: string;
  total_hours: number;
  verified_hours: number;
  skills: string[];
  status: 'active' | 'inactive';
  user_id?: number;
  opportunities: {
    id: number;
    title: string;
    status: 'ongoing' | 'completed' | 'upcoming';
  }[];
}

export const createMockOrganization = (): MockOrganization => ({
  id: 1,
  name: "Community Impact Alliance",
  contact_email: "info@communityimpact.org",
  description: "A nonprofit organization dedicated to improving lives through community service, education, and environmental stewardship.",
  location: "Downtown Community Hub, 123 Main Street"
});

export const createMockOpportunities = (organizationId: number, organizationName: string): MockOpportunity[] => [
  {
    id: 1,
    title: "Community Garden Volunteer",
    description: "Help maintain our community garden by planting, weeding, and harvesting fresh produce for local food banks. Perfect for those who love working outdoors and making a direct impact on food security.",
    location: "Downtown Community Center, 123 Main St",
    date_posted: "2024-01-15T10:00:00Z",
    deadline: "2024-03-01T23:59:59Z",
    start_date: "2024-02-01T09:00:00Z",
    end_date: "2024-05-31T17:00:00Z",
    status: 'active',
    required_skills: ["Gardening", "Physical Labor", "Teamwork"],
    time_commitment: "4 hours per week",
    organization_id: organizationId,
    organization: { id: organizationId, name: organizationName },
    applications_count: 12,
    volunteers_needed: 8,
    volunteers_registered: 5
  },
  {
    id: 2,
    title: "Youth Mentorship Program",
    description: "Mentor high school students in career development, college preparation, and life skills. Share your professional experience and help shape the next generation of leaders.",
    location: "Lincoln High School, 456 Oak Avenue",
    date_posted: "2024-01-10T14:30:00Z",
    deadline: "2024-02-15T23:59:59Z",
    start_date: "2024-02-20T16:00:00Z",
    end_date: "2024-06-15T18:00:00Z",
    status: 'active',
    required_skills: ["Mentoring", "Communication", "Leadership", "Career Guidance"],
    time_commitment: "2 hours per week",
    organization_id: organizationId,
    organization: { id: organizationId, name: organizationName },
    applications_count: 8,
    volunteers_needed: 15,
    volunteers_registered: 10
  },
  {
    id: 3,
    title: "Senior Technology Support",
    description: "Teach seniors how to use smartphones, tablets, and computers. Help bridge the digital divide by providing patient, one-on-one technology instruction.",
    location: "Sunset Senior Center, 789 Pine Street",
    date_posted: "2024-01-08T11:15:00Z",
    deadline: "2024-02-28T23:59:59Z",
    start_date: "2024-02-05T10:00:00Z",
    end_date: "2024-04-30T16:00:00Z",
    status: 'active',
    required_skills: ["Technology", "Teaching", "Patience", "Communication"],
    time_commitment: "3 hours per week",
    organization_id: organizationId,
    organization: { id: organizationId, name: organizationName },
    applications_count: 6,
    volunteers_needed: 10,
    volunteers_registered: 4
  },
  {
    id: 4,
    title: "Food Bank Sorting & Distribution",
    description: "Sort donated food items, pack family boxes, and assist with food distribution to families in need. A hands-on way to fight hunger in our community.",
    location: "Central Food Bank, 321 Elm Drive",
    date_posted: "2024-01-05T09:00:00Z",
    deadline: "2024-12-31T23:59:59Z",
    start_date: "2024-01-20T08:00:00Z",
    end_date: "2024-12-20T17:00:00Z",
    status: 'active',
    required_skills: ["Organization", "Physical Labor", "Teamwork"],
    time_commitment: "4 hours per month",
    organization_id: organizationId,
    organization: { id: organizationId, name: organizationName },
    applications_count: 25,
    volunteers_needed: 20,
    volunteers_registered: 18
  },
  {
    id: 5,
    title: "Animal Shelter Assistant",
    description: "Care for rescued animals by feeding, cleaning, walking dogs, and socializing cats. Help animals find their forever homes through love and care.",
    location: "Happy Paws Animal Shelter, 654 Birch Lane",
    date_posted: "2024-01-03T13:45:00Z",
    deadline: "2024-03-15T23:59:59Z",
    start_date: "2024-02-01T10:00:00Z",
    end_date: "2024-07-31T16:00:00Z",
    status: 'active',
    required_skills: ["Animal Care", "Physical Fitness", "Compassion"],
    time_commitment: "6 hours per week",
    organization_id: organizationId,
    organization: { id: organizationId, name: organizationName },
    applications_count: 15,
    volunteers_needed: 12,
    volunteers_registered: 8
  },
  {
    id: 6,
    title: "Environmental Cleanup Crew",
    description: "Join our monthly environmental cleanup efforts in local parks, beaches, and waterways. Help preserve our natural spaces for future generations.",
    location: "Various locations around the city",
    date_posted: "2023-12-20T16:20:00Z",
    deadline: "2024-06-30T23:59:59Z",
    start_date: "2024-01-15T09:00:00Z",
    end_date: "2024-06-15T15:00:00Z",
    status: 'completed',
    required_skills: ["Environmental Awareness", "Physical Labor", "Teamwork"],
    time_commitment: "4 hours per month",
    organization_id: organizationId,
    organization: { id: organizationId, name: organizationName },
    applications_count: 30,
    volunteers_needed: 25,
    volunteers_registered: 25
  },
  {
    id: 7,
    title: "Literacy Tutoring Program",
    description: "Help adults improve their reading and writing skills through one-on-one tutoring sessions. Make a lasting impact on someone's educational journey.",
    location: "Public Library, 987 Cedar Street",
    date_posted: "2023-12-15T12:00:00Z",
    deadline: "2024-01-31T23:59:59Z",
    start_date: "2024-02-10T14:00:00Z",
    end_date: "2024-05-10T17:00:00Z",
    status: 'inactive',
    required_skills: ["Teaching", "Literacy", "Patience", "Communication"],
    time_commitment: "2 hours per week",
    organization_id: organizationId,
    organization: { id: organizationId, name: organizationName },
    applications_count: 4,
    volunteers_needed: 8,
    volunteers_registered: 2
  },
  {
    id: 8,
    title: "Website Development Project",
    description: "Help redesign our organization's website to better serve our community. Looking for volunteers with web development, design, or content creation skills.",
    location: "Remote/Virtual",
    date_posted: "2024-01-12T15:00:00Z",
    deadline: "2024-02-20T23:59:59Z",
    start_date: "2024-02-25T09:00:00Z",
    end_date: "2024-04-25T17:00:00Z",
    status: 'draft',
    required_skills: ["Web Development", "Graphic Design", "Content Writing", "UX/UI"],
    time_commitment: "5 hours per week",
    organization_id: organizationId,
    organization: { id: organizationId, name: organizationName },
    applications_count: 0,
    volunteers_needed: 5,
    volunteers_registered: 0
  }
];

export const createMockVolunteers = (organizationId: number): MockVolunteer[] => [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    avatar: null,
    phone: "(555) 123-4567",
    location: "Downtown District",
    joined_date: "2023-09-15T10:00:00Z",
    total_hours: 45,
    verified_hours: 40,
    skills: ["Gardening", "Teaching", "Event Planning"],
    status: 'active',
    user_id: 101,
    opportunities: [
      { id: 1, title: "Community Garden Volunteer", status: 'ongoing' },
      { id: 2, title: "Youth Mentorship Program", status: 'completed' }
    ]
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@email.com",
    avatar: null,
    phone: "(555) 234-5678",
    location: "Riverside Area",
    joined_date: "2023-10-22T14:30:00Z",
    total_hours: 32,
    verified_hours: 32,
    skills: ["Technology", "Teaching", "Patience"],
    status: 'active',
    user_id: 102,
    opportunities: [
      { id: 3, title: "Senior Technology Support", status: 'ongoing' }
    ]
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    avatar: null,
    phone: "(555) 345-6789",
    location: "Westside",
    joined_date: "2023-08-10T09:15:00Z",
    total_hours: 67,
    verified_hours: 60,
    skills: ["Animal Care", "Organization", "Physical Labor"],
    status: 'active',
    user_id: 103,
    opportunities: [
      { id: 4, title: "Food Bank Sorting & Distribution", status: 'ongoing' },
      { id: 5, title: "Animal Shelter Assistant", status: 'ongoing' },
      { id: 6, title: "Environmental Cleanup Crew", status: 'completed' }
    ]
  },
  {
    id: 4,
    name: "David Thompson",
    email: "david.thompson@email.com",
    avatar: null,
    phone: "(555) 456-7890",
    location: "North Hills",
        joined_date: "2023-11-05T16:45:00Z",
    total_hours: 28,
    verified_hours: 25,
    skills: ["Mentoring", "Communication", "Leadership"],
    status: 'active',
    user_id: 104,
    opportunities: [
      { id: 2, title: "Youth Mentorship Program", status: 'ongoing' }
    ]
  },
  {
    id: 5,
    name: "Lisa Park",
    email: "lisa.park@email.com",
    avatar: null,
    phone: "(555) 567-8901",
    location: "East Village",
    joined_date: "2023-07-18T11:20:00Z",
    total_hours: 89,
    verified_hours: 85,
    skills: ["Environmental Awareness", "Organization", "Teaching"],
    status: 'active',
    user_id: 105,
    opportunities: [
      { id: 6, title: "Environmental Cleanup Crew", status: 'completed' },
      { id: 7, title: "Literacy Tutoring Program", status: 'ongoing' },
      { id: 1, title: "Community Garden Volunteer", status: 'ongoing' }
    ]
  },
  {
    id: 6,
    name: "Robert Wilson",
    email: "robert.wilson@email.com",
    avatar: null,
    phone: "(555) 678-9012",
    location: "South Bay",
    joined_date: "2023-12-01T13:10:00Z",
    total_hours: 15,
    verified_hours: 12,
    skills: ["Web Development", "Graphic Design", "UX/UI"],
    status: 'inactive',
    user_id: 106,
    opportunities: [
      { id: 8, title: "Website Development Project", status: 'upcoming' }
    ]
  },
  {
    id: 7,
    name: "Amanda Foster",
    email: "amanda.foster@email.com",
    avatar: null,
    phone: "(555) 789-0123",
    location: "Central District",
    joined_date: "2023-06-25T08:30:00Z",
    total_hours: 112,
    verified_hours: 108,
    skills: ["Healthcare Knowledge", "Event Planning", "Communication"],
    status: 'active',
    user_id: 107,
    opportunities: [
      { id: 4, title: "Food Bank Sorting & Distribution", status: 'ongoing' },
      { id: 6, title: "Environmental Cleanup Crew", status: 'completed' }
    ]
  },
  {
    id: 8,
    name: "James Martinez",
    email: "james.martinez@email.com",
    avatar: null,
    phone: "(555) 890-1234",
    location: "Harbor District",
    joined_date: "2023-09-30T15:45:00Z",
    total_hours: 38,
    verified_hours: 35,
    skills: ["Physical Labor", "Teamwork", "Organization"],
    status: 'active',
    user_id: 108,
    opportunities: [
      { id: 4, title: "Food Bank Sorting & Distribution", status: 'ongoing' },
      { id: 1, title: "Community Garden Volunteer", status: 'ongoing' }
    ]
  }
];

// Mock data for volunteer hours
export interface MockVolunteerHour {
  id: number;
  volunteer_id: number;
  opportunity_id: number;
  hours: number;
  date: string;
  description: string;
  status: 'pending' | 'verified' | 'rejected';
  verified_by?: string;
  verified_at?: string;
}

export const createMockVolunteerHours = (): MockVolunteerHour[] => [
  {
    id: 1,
    volunteer_id: 1,
    opportunity_id: 1,
    hours: 4,
    date: "2024-01-15T09:00:00Z",
    description: "Planted tomatoes and peppers in the community garden",
    status: 'verified',
    verified_by: "Garden Coordinator",
    verified_at: "2024-01-16T10:00:00Z"
  },
  {
    id: 2,
    volunteer_id: 1,
    opportunity_id: 2,
    hours: 2,
    date: "2024-01-18T16:00:00Z",
    description: "Mentored student on college application process",
    status: 'verified',
    verified_by: "Program Director",
    verified_at: "2024-01-19T09:00:00Z"
  },
  {
    id: 3,
    volunteer_id: 2,
    opportunity_id: 3,
    hours: 3,
    date: "2024-01-20T10:00:00Z",
    description: "Taught seniors how to use email and video calling",
    status: 'pending'
  },
  {
    id: 4,
    volunteer_id: 3,
    opportunity_id: 4,
    hours: 4,
    date: "2024-01-22T08:00:00Z",
    description: "Sorted and packed food donations for 50 families",
    status: 'verified',
    verified_by: "Food Bank Manager",
    verified_at: "2024-01-23T12:00:00Z"
  },
  {
    id: 5,
    volunteer_id: 3,
    opportunity_id: 5,
    hours: 6,
    date: "2024-01-25T10:00:00Z",
    description: "Fed animals, cleaned kennels, and walked 8 dogs",
    status: 'verified',
    verified_by: "Shelter Supervisor",
    verified_at: "2024-01-26T08:00:00Z"
  }
];

// Mock data for applications/matches
export interface MockApplication {
  id: number;
  volunteer_id: number;
  opportunity_id: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  applied_at: string;
  message?: string;
  volunteer_name: string;
  volunteer_email: string;
  opportunity_title: string;
}

export const createMockApplications = (): MockApplication[] => [
  {
    id: 1,
    volunteer_id: 1,
    opportunity_id: 1,
    status: 'approved',
    applied_at: "2024-01-10T14:30:00Z",
    message: "I have experience with organic gardening and would love to help the community.",
    volunteer_name: "Sarah Johnson",
    volunteer_email: "sarah.johnson@email.com",
    opportunity_title: "Community Garden Volunteer"
  },
  {
    id: 2,
    volunteer_id: 2,
    opportunity_id: 3,
    status: 'approved',
    applied_at: "2024-01-12T09:15:00Z",
    message: "As a software engineer, I'm passionate about helping seniors with technology.",
    volunteer_name: "Michael Chen",
    volunteer_email: "michael.chen@email.com",
    opportunity_title: "Senior Technology Support"
  },
  {
    id: 3,
    volunteer_id: 3,
    opportunity_id: 4,
    status: 'approved',
    applied_at: "2024-01-08T16:45:00Z",
    message: "I've volunteered at food banks before and understand the importance of this work.",
    volunteer_name: "Emily Rodriguez",
    volunteer_email: "emily.rodriguez@email.com",
    opportunity_title: "Food Bank Sorting & Distribution"
  },
  {
    id: 4,
    volunteer_id: 4,
    opportunity_id: 2,
    status: 'pending',
    applied_at: "2024-01-20T11:20:00Z",
    message: "I work in education and would like to mentor high school students.",
    volunteer_name: "David Thompson",
    volunteer_email: "david.thompson@email.com",
    opportunity_title: "Youth Mentorship Program"
  },
  {
    id: 5,
    volunteer_id: 5,
    opportunity_id: 1,
    status: 'pending',
    applied_at: "2024-01-22T13:10:00Z",
    message: "I'm interested in sustainable agriculture and community building.",
    volunteer_name: "Lisa Park",
    volunteer_email: "lisa.park@email.com",
    opportunity_title: "Community Garden Volunteer"
  },
  {
    id: 6,
    volunteer_id: 6,
    opportunity_id: 8,
    status: 'rejected',
    applied_at: "2024-01-18T10:30:00Z",
    message: "I'm a full-stack developer with 5 years of experience.",
    volunteer_name: "Robert Wilson",
    volunteer_email: "robert.wilson@email.com",
    opportunity_title: "Website Development Project"
  }
];

// Utility functions for mock data
export const getMockDataForOrganization = (organizationId?: number) => {
  const orgId = organizationId || 1;
  const organization = createMockOrganization();
  const opportunities = createMockOpportunities(orgId, organization.name);
  const volunteers = createMockVolunteers(orgId);
  const hours = createMockVolunteerHours();
  const applications = createMockApplications();

  return {
    organization,
    opportunities,
    volunteers,
    hours,
    applications
  };
};

export const getRandomMockData = () => {
  const organizations = [
    { id: 1, name: "Community Impact Alliance" },
    { id: 2, name: "Green Future Foundation" },
    { id: 3, name: "Youth Development Center" },
    { id: 4, name: "Senior Care Network" },
    { id: 5, name: "Animal Welfare Society" }
  ];

  const randomOrg = organizations[Math.floor(Math.random() * organizations.length)];
  return getMockDataForOrganization(randomOrg.id);
};

// Mock API response formatters
export const formatMockApiResponse = <T>(data: T, includeMetadata = true) => {
  if (!includeMetadata) {
    return data;
  }

  return {
    data,
    items: Array.isArray(data) ? data : undefined,
    total: Array.isArray(data) ? data.length : 1,
    page: 1,
    limit: Array.isArray(data) ? data.length : 1,
    has_more: false,
    generated_at: new Date().toISOString(),
    is_mock: true
  };
};

// Mock delay function to simulate API calls
export const mockApiDelay = (ms: number = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const MOCK_VOLUNTEER_DATA = {
  user: {
    id: 1,
    full_name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    skills: ["Teaching", "Event Planning", "First Aid"],
    bio: "Passionate volunteer with 3+ years of community service experience."
  },
  stats: {
    total_hours: 45,
    verified_hours: 32,
    pending_hours: 8,
    rejected_hours: 5
  },
  matches: [
    { 
      id: 1, 
      status: 'accepted', 
      opportunity_id: 1,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-16T14:30:00Z'
    },
    { 
      id: 2, 
      status: 'accepted', 
      opportunity_id: 2,
      created_at: '2024-01-20T09:00:00Z',
      updated_at: '2024-01-21T11:15:00Z'
    },
    { 
      id: 3, 
      status: 'completed', 
      opportunity_id: 3,
      created_at: '2024-01-10T08:00:00Z',
      updated_at: '2024-01-25T16:45:00Z'
    },
    { 
      id: 4, 
      status: 'completed', 
      opportunity_id: 4,
      created_at: '2024-01-05T07:30:00Z',
      updated_at: '2024-01-20T18:20:00Z'
    },
    { 
      id: 5, 
      status: 'pending', 
      opportunity_id: 5,
      created_at: '2024-01-28T12:00:00Z',
      updated_at: '2024-01-28T12:00:00Z'
    }
  ],
  opportunities: [
    {
      id: 1,
      title: "Beach Cleanup Drive",
      organization: { 
        id: 1,
        name: "Ocean Conservation Society",
        location: "Santa Monica, CA"
      },
      description: "Help clean up local beaches and protect marine life. We provide all equipment and refreshments.",
      location: "Santa Monica Beach",
      date: "2024-02-15",
      time: "09:00 AM - 1:00 PM",
      volunteers_needed: 25,
      volunteers_registered: 18,
      skills_required: ["Physical Fitness", "Environmental Awareness"],
      category: "Environment"
    },
    {
      id: 2,
      title: "Food Bank Volunteer",
      organization: { 
        id: 2,
        name: "Community Food Network",
        location: "Downtown LA"
      },
      description: "Sort and distribute food to families in need. Perfect for individuals or groups looking to make a direct impact.",
      location: "Community Center, 123 Main St",
      date: "2024-02-18",
      time: "10:00 AM - 3:00 PM",
      volunteers_needed: 15,
      volunteers_registered: 12,
      skills_required: ["Organization", "Customer Service"],
      category: "Social Services"
    },
    {
      id: 3,
      title: "Youth Mentorship Program",
      organization: { 
        id: 3,
        name: "Future Leaders Foundation",
        location: "Beverly Hills, CA"
      },
      description: "Mentor high school students in career development, college preparation, and life skills.",
      location: "Lincoln High School",
      date: "2024-02-20",
      time: "3:30 PM - 5:30 PM",
      volunteers_needed: 10,
      volunteers_registered: 8,
      skills_required: ["Teaching", "Communication", "Leadership"],
      category: "Education"
    },
    {
      id: 4,
      title: "Senior Care Assistance",
      organization: { 
        id: 4,
        name: "Golden Years Care",
        location: "Pasadena, CA"
      },
      description: "Provide companionship and assistance to elderly residents. Activities include reading, games, and light assistance.",
      location: "Sunset Senior Living",
      date: "2024-02-22",
      time: "2:00 PM - 6:00 PM",
      volunteers_needed: 8,
      volunteers_registered: 6,
      skills_required: ["Patience", "Communication", "Empathy"],
      category: "Healthcare"
    },
    {
      id: 5,
      title: "Animal Shelter Helper",
      organization: { 
        id: 5,
        name: "Paws & Hearts Rescue",
        location: "West Hollywood, CA"
      },
      description: "Help care for rescued animals and assist with adoptions. Tasks include feeding, cleaning, and socializing animals.",
      location: "Paws & Hearts Shelter",
      date: "2024-02-25",
      time: "8:00 AM - 12:00 PM",
      volunteers_needed: 12,
      volunteers_registered: 9,
      skills_required: ["Animal Care", "Physical Fitness", "Reliability"],
      category: "Animal Welfare"
    }
  ],
  volunteerHours: [
    {
      id: 1,
      opportunity_id: 3,
      hours: 4,
      date: "2024-01-25",
      description: "Mentored 3 students in college application process",
      status: "verified",
      verified_by: "Jane Smith",
      verified_at: "2024-01-26T10:00:00Z"
    },
    {
      id: 2,
      opportunity_id: 4,
      hours: 6,
      date: "2024-01-20",
      description: "Assisted with activities and provided companionship",
      status: "verified",
      verified_by: "Mike Johnson",
      verified_at: "2024-01-21T15:30:00Z"
    },
    {
      id: 3,
      opportunity_id: 1,
      hours: 4,
      date: "2024-01-28",
      description: "Beach cleanup - collected 15 bags of trash",
      status: "pending",
      verified_by: null,
      verified_at: null
    }
  ]
};

export const MOCK_ORGANIZATION_DATA = {
  organization: {
    id: 1,
    name: "Ocean Conservation Society",
    description: "Dedicated to protecting marine ecosystems through community action and education.",
    contact_email: "info@oceanconservation.org",
    location: "Santa Monica, CA",
    website: "https://oceanconservation.org",
    phone: "+1 (555) 987-6543",
    founded: "2015",
    volunteers_count: 150,
    opportunities_count: 8
  },
  opportunities: [
    {
      id: 1,
      title: "Beach Cleanup Drive",
      description: "Monthly beach cleanup to protect marine life",
      location: "Santa Monica Beach",
      date: "2024-02-15",
      volunteers_needed: 25,
      volunteers_registered: 18,
      status: "active"
    },
    {
      id: 6,
      title: "Marine Life Education Workshop",
      description: "Teach children about ocean conservation",
      location: "Santa Monica Pier Aquarium",
      date: "2024-02-28",
      volunteers_needed: 8,
      volunteers_registered: 5,
      status: "active"
    }
  ],
  stats: {
    total_volunteers: 150,
    active_opportunities: 8,
    total_hours_logged: 2450,
    this_month_hours: 180
  }
};

export const MOCK_ADMIN_DATA = {
  stats: {
    total_users: 1250,
    total_volunteers: 980,
    total_organizations: 45,
    total_opportunities: 156,
    total_hours: 15680,
    pending_verifications: 23
  },
  recentActivity: [
    {
      id: 1,
      type: "new_user",
      message: "New volunteer registered: Sarah Johnson",
      timestamp: "2024-01-28T14:30:00Z"
    },
    {
      id: 2,
      type: "new_opportunity",
      message: "New opportunity posted: Community Garden Project",
      timestamp: "2024-01-28T12:15:00Z"
    },
    {
      id: 3,
      type: "hours_logged",
      message: "25 volunteer hours logged today",
      timestamp: "2024-01-28T10:45:00Z"
    }
  ]
};

export default {
  createMockOrganization,
  createMockOpportunities,
  createMockVolunteers,
  createMockVolunteerHours,
  createMockApplications,
  getMockDataForOrganization,
  getRandomMockData,
  formatMockApiResponse,
  mockApiDelay
};
