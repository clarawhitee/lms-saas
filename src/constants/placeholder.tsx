// Importing the necessary icon components from the specified path. 
import {
  Chat,
  Courses,
  Document,
  Grid,
  Heart,
  MegaPhone,
  WhiteLabel,
} from "@/icons"

// Defining the type for the placeholder properties that each group will utilize.
export type CreateGroupPlaceholderProps = {
  id: string        // Unique identifier for each group placeholder
  label: string     // Description or label text for the placeholder
  icon: JSX.Element // JSX Element representing the icon associated with the placeholder
}

// Array of placeholders that can be used for creating groups. 
// Each object contains an id, label, and icon.
export const CREATE_GROUP_PLACEHOLDER: CreateGroupPlaceholderProps[] = [
  {
    id: "0",
    label: "Highly engaging", // Describes the engagement level of the group
    icon: <MegaPhone />,      // Icon representing engagement
  },
  {
    id: "1",
    label: "Easy to setup",    // Indicates that setting up the group is straightforward
    icon: <Heart />,          // Icon symbolizing ease and care
  },
  {
    id: "2",
    label: "Group chat and posts", // Highlights that there are communication features available
    icon: <Chat />,                 // Icon representing chat functionality
  },
  {
    id: "3",
    label: "Students can create teams within Groups", // Emphasizes the collaborative aspect
    icon: <Grid />,                                      // Icon representing teamwork or structure
  },
  {
    id: "4",
    label: "Gamification", // Indicates that there are game-like features to enhance interaction
    icon: <Document />,    // Icon that could represent documentation or gaming features
  },
  {
    id: "5",
    label: "Host unlimited courses",  // Highlights the ability to manage multiple educational courses
    icon: <Courses />,                 // Icon representing educational content or courses
  },
  {
    id: "6",
    label: "White-labeling options",  // Indicates availability for branding and customization
    icon: <WhiteLabel />,             // Icon representing white-labeling or branding
  },
]
