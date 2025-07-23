const apiUrl = "https://robodemybd.com/wp-json/tutor/v1/courses";
const apiKey = "key_184d71d88b68f12744a891aa992ecbf3";
const apiSecret =
  "secret_f022c74ed9fbbe6ae09cba28787319bfde7755a65691c934105924c3f95f2c21";

const container = document.getElementById("courses-container");

// Fetch courses from the API
async function fetchCourses() {
  try {
    const credentials = btoa(`${apiKey}:${apiSecret}`);
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error("Failed to fetch courses");

    const result = await response.json();
    const courses = result.data.posts;

    // Extract unique dynamic categories
    const categories = getCourseCategoriesArray(courses);
    renderCategoryTabs(categories, courses);
  } catch (error) {
    console.error("Error fetching courses:", error.message);
  }
}

// Return an array of unique category names (handles multiple categories per course)
function getCourseCategoriesArray(courses) {
  const categorySet = new Set();
  courses.forEach(course => {
    if (Array.isArray(course.course_category) && course.course_category.length > 0) {
      course.course_category.forEach(cat => categorySet.add(cat.name));
    } else {
      categorySet.add("Uncategorized");
    }
  });
  return Array.from(categorySet);
}

// Dynamically render category tabs based on the unique categories
function renderCategoryTabs(categories, allCourses) {
  const tabContainer = document.getElementById("category-tabs");
  tabContainer.innerHTML = "";

  categories.forEach((category, index) => {
    const tab = document.createElement("button");
    tab.className = "category-tab";
    tab.textContent = category;

    tab.addEventListener("click", () => {
      document.querySelectorAll(".category-tab").forEach(btn =>
        btn.classList.remove("active")
      );
      tab.classList.add("active");

      const filteredCourses = allCourses.filter(course => {
        // If the category is Uncategorized, show courses with no categories or empty list
        if (category === "Uncategorized") {
          return !course.course_category || course.course_category.length === 0;
        }
        // Otherwise, check if course has this category among its multiple categories
        return course.course_category?.some(cat => cat.name === category);
      });

      displayCourses(filteredCourses);
    });

    tabContainer.appendChild(tab);

    // Auto-select the first tab by clicking it
    if (index === 0) {
      tab.click();
    }
  });
}

// Render course cards in the courses container
function displayCourses(courses) {
  container.innerHTML = "";

  if (courses.length === 0) {
    container.innerHTML = "<p>No courses found.</p>";
    return;
  }

  courses.forEach(course => {
    // If the course has multiple categories, join them into a string
    const allCategories =
      Array.isArray(course.course_category) && course.course_category.length > 0
        ? course.course_category.map(cat => cat.name).join(", ")
        : "Uncategorized";

    const card = document.createElement("div");
    card.className = "course-card";
    card.innerHTML = `
      <img src="${course.thumbnail_url}" alt="${course.post_title}" class="course-image">
      <h2>${course.post_title}</h2>
      <p><strong>Status:</strong> ${course.post_status}</p>
      <p><strong>Categories:</strong> ${allCategories}</p>
      <p>${course.post_content}</p>
      <a href="https://robodemybd.com/courses/${course.post_name}" target="_blank">View Course</a>
    `;
    container.appendChild(card);
  });
}

fetchCourses();
