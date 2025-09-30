// * Faculties and Departments Data
// * Provides structured lists for faculty and department selects

export interface Department {
  id: string;
  name: string;
  slug: string;
}

export interface Faculty {
  id: string;
  name: string;
  slug: string;
  departments: Department[];
}

export const faculties: Faculty[] = [
  {
    id: "fag",
    name: "Faculty of Agriculture",
    slug: "agriculture",
    departments: [
      { id: "agr", name: "Agriculture", slug: "agriculture" },
      { id: "aee", name: "Agricultural Economics and Extension Services", slug: "agricultural-economics-extension" },
      { id: "anp", name: "Animal Production", slug: "animal-production" },
      { id: "crp", name: "Crop Production", slug: "crop-production" },
      { id: "fst", name: "Food Science and Technology", slug: "food-science-technology" },
      { id: "fae", name: "Food and Agricultural Engineering", slug: "food-agricultural-engineering" },
      { id: "faq", name: "Fisheries and Aquaculture", slug: "fisheries-aquaculture" }
    ]
  },
  {
    id: "fahs",
    name: "Faculty of Allied Health Sciences",
    slug: "allied-health-sciences",
    departments: [
      { id: "ehs", name: "Environmental Health Science", slug: "environmental-health-science" },
      { id: "mls", name: "Medical Laboratory Science", slug: "medical-laboratory-science" }
    ]
  },
  {
    id: "fart",
    name: "Faculty of Arts",
    slug: "arts",
    departments: [
      { id: "arb", name: "Arabic", slug: "arabic" },
      { id: "cat", name: "Creative Arts and Tourism", slug: "creative-arts-tourism" },
      { id: "eng", name: "English and Linguistics", slug: "english-linguistics" },
      { id: "hds", name: "History and Diplomatic Studies", slug: "history-diplomatic-studies" },
      { id: "paf", name: "Performing Arts and Film Studies", slug: "performing-arts-film" },
      { id: "rel", name: "Religions", slug: "religions" },
      { id: "rhh", name: "Religions, History and Heritage Studies", slug: "religions-history-heritage" },
      { id: "thm", name: "Tourism and Hospitality Management", slug: "tourism-hospitality" }
    ]
  },
  {
    id: "fbms",
    name: "Faculty of Basic Medical Sciences",
    slug: "basic-medical-sciences",
    departments: [
      { id: "ana", name: "Anatomy", slug: "anatomy" },
      { id: "bio", name: "Biochemistry", slug: "biochemistry" },
      { id: "phy", name: "Physiology", slug: "physiology" },
      { id: "mic", name: "Microbiology", slug: "microbiology" },
      { id: "cmm", name: "Community Medicine", slug: "community-medicine" },
      { id: "phs", name: "Public Health Science", slug: "public-health-science" }
    ]
  },
  {
    id: "fedu",
    name: "Faculty of Education",
    slug: "education",
    departments: [
      { id: "ase", name: "Arts and Science Education", slug: "arts-science-education" },
      { id: "bed", name: "Business Education", slug: "business-education" },
      { id: "ecp", name: "Early Childhood and Primary Education", slug: "early-childhood-primary" },
      { id: "edm", name: "Education Management", slug: "education-management" },
      { id: "sed", name: "Special Education", slug: "special-education" },
      { id: "hks", name: "Human Kinetics and Sport Administration", slug: "human-kinetics-sport" }
    ]
  },
  {
    id: "fes",
    name: "Faculty of Environmental Sciences",
    slug: "environmental-sciences",
    departments: [
      { id: "emt", name: "Environmental Management and Toxicology", slug: "environmental-management-toxicology" }
    ]
  },
  {
    id: "fet",
    name: "Faculty of Engineering and Technology",
    slug: "engineering-technology",
    departments: [
      { id: "aae", name: "Aeronautical and Astronautical Engineering", slug: "aeronautical-astronautical" },
      { id: "cee", name: "Civil and Environmental Engineering", slug: "civil-environmental" },
      { id: "ece", name: "Electrical and Computer Engineering", slug: "electrical-computer" },
      { id: "mec", name: "Mechanical Engineering", slug: "mechanical-engineering" },
      { id: "mse", name: "Material Science and Engineering", slug: "material-science-engineering" }
    ]
  },
  {
    id: "fict",
    name: "Faculty of Information and Communication Technology",
    slug: "information-communication-technology",
    departments: [
      { id: "csc", name: "Computer Science", slug: "computer-science" },
      { id: "mac", name: "Mass Communication", slug: "mass-communication" }
    ]
  },
  {
    id: "flaw",
    name: "Faculty of Law",
    slug: "law",
    departments: [
      { id: "cml", name: "Common Law", slug: "common-law" },
      { id: "bpl", name: "Business and Private Law", slug: "business-private-law" },
      { id: "isl", name: "Islamic Law", slug: "islamic-law" },
      { id: "jpl", name: "Jurisprudence and Public Law", slug: "jurisprudence-public-law" }
    ]
  },
  {
    id: "fmss",
    name: "Faculty of Management and Social Sciences",
    slug: "management-social-sciences",
    departments: [
      { id: "acf", name: "Accounting and Finance", slug: "accounting-finance" },
      { id: "bad", name: "Business Administration", slug: "business-administration" },
      { id: "ben", name: "Business and Entrepreneurship", slug: "business-entrepreneurship" },
      { id: "eds", name: "Economics and Development Studies", slug: "economics-development" },
      { id: "pog", name: "Politics and Governance", slug: "politics-governance" },
      { id: "lis", name: "Library and Information Science", slug: "library-information-science" }
    ]
  },
  {
    id: "fpas",
    name: "Faculty of Pure and Applied Sciences",
    slug: "pure-applied-sciences",
    departments: [
      { id: "peb", name: "Plant and Environmental Biology", slug: "plant-environmental-biology" },
      { id: "bsy", name: "Biosystematics", slug: "biosystematics" },
      { id: "chm", name: "Chemistry and Industrial Chemistry", slug: "chemistry-industrial" },
      { id: "geo", name: "Geology and Mineral Science", slug: "geology-mineral-science" },
      { id: "mat", name: "Mathematics and Statistics", slug: "mathematics-statistics" },
      { id: "phm", name: "Physics and Materials Science", slug: "physics-materials-science" },
      { id: "zoo", name: "Zoology", slug: "zoology" }
    ]
  }
];

export function findFacultyById(facultyId: string): Faculty | undefined {
  return faculties.find(f => f.id === facultyId);
}

export function findDepartmentById(facultyId: string, departmentId: string): Department | undefined {
  const faculty = findFacultyById(facultyId);
  return faculty?.departments.find(d => d.id === departmentId);
}

export function findFacultyByName(name: string): Faculty | undefined {
  const n = String(name || '').trim().toLowerCase();
  return faculties.find(f => f.name.toLowerCase() === n || f.slug.toLowerCase() === n || f.id.toLowerCase() === n);
}

export function findDepartmentByName(name: string): Department | undefined {
  const n = String(name || '').trim().toLowerCase();
  for (const f of faculties) {
    const dep = f.departments.find(d => d.name.toLowerCase() === n || d.slug.toLowerCase() === n || d.id.toLowerCase() === n);
    if (dep) return dep;
  }
  return undefined;
}


