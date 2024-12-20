import {
  getAllHomeTests,
  getProjectById,
} from "@/controllers/projects.controller";
import React, { useState } from "react";

function Projects() {
  const [projectId, setProjectId] = useState("");
  const [project, setProject] = useState(null);

  const handleGetAllProjects = async () => {
    try {
      await getAllHomeTests();
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleGetProjectById = async () => {
    try {
      const projectData = await getProjectById(projectId);
      setProject(projectData);
    } catch (error) {
      console.error("Error fetching project by ID:", error);
    }
  };

  return (
    <div>
      <button onClick={handleGetAllProjects}>GET ALL</button>

      <div>
        <input
          type="text"
          placeholder="Enter Project ID"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        />
        <button onClick={handleGetProjectById}>GET BY ID</button>
      </div>

      {project && (
        <div>
          <h2>Project Details</h2>
          <pre>{JSON.stringify(project, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Projects;
