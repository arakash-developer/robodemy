const apiUrl = "https://robodemybd.com/wp-json/tutor/v1/courses";
const apiKey = "key_184d71d88b68f12744a891aa992ecbf3";
const apiSecret =
  "secret_f022c74ed9fbbe6ae09cba28787319bfde7755a65691c934105924c3f95f2c21";

const container = document.getElementById("courses-container");

async function fetchCourses() {
  try {
    const credentials = btoa(`${apiKey}:${apiSecret}`);

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
    });
    // console.log(response);

    if (!response.ok) throw new Error("Failed to fetch courses");

    const courses = await response.json();
    console.log(courses.data.posts);

    displayCourses(courses.data.posts);
  } catch (error) {
    console.log(`Error fetching courses: ${error.message}`);
  }
}

function displayCourses(courses) {
  if (courses.length === 0) {
    container.innerHTML = `<p>No courses found.</p>`;
    return;
  }

  container.innerHTML = "";
  courses.forEach((course) => {
    const card = document.createElement("div");
    card.className = "course-card";
    card.innerHTML = `
    <div>
    <img src="${course.thumbnail_url}" alt="${course.thumbnail_url}" class="course-image">
    </div>
      <h2>${course.post_title}</h2>
      <p>Status: ${course.post_status}</p>
      <p>${course.post_content}</p>
      <a href="https://robodemybd.com/courses/${course.post_name}" target="_blank">View Course</a>

    `;
    container.appendChild(card);
  });
}

fetchCourses();
