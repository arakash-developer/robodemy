const apiUrl = "https://robodemybd.com/wp-json/tutor/v1/courses";
const apiKey = "key_184d71d88b68f12744a891aa992ecbf3";
const apiSecret =
  "secret_f022c74ed9fbbe6ae09cba28787319bfde7755a65691c934105924c3f95f2c21";

const container = document.getElementById("robodemy-courses-container");

async function fetchCourses() {
  try {
    const credentials = btoa(`${apiKey}:${apiSecret}`);
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch courses");

    const result = await response.json();
    const courses = result.data.posts;
    console.log("Fetched courses:", courses);

    const categories = getCourseCategoriesArray(courses);
    renderCategoryTabs(categories, courses);
  } catch (error) {
    console.error("Error fetching courses:", error.message);
  }
}

function getCourseCategoriesArray(courses) {
  const categorySet = new Set();

  // Collect real categories only
  courses.forEach((course) => {
    if (
      Array.isArray(course.course_category) &&
      course.course_category.length > 0
    ) {
      course.course_category.forEach((cat) => categorySet.add(cat.name));
    }
  });

  // Always start with "All Courses"
  return ["All Courses", ...Array.from(categorySet)];
}

function renderCategoryTabs(categories, allCourses) {
  const tabContainer = document.getElementById("robodemy-category-tabs");
  tabContainer.innerHTML = "";

  categories.forEach((category, index) => {
    const tab = document.createElement("button");
    tab.className = "robodemy-category-tab";
    tab.textContent = category;

    tab.addEventListener("click", () => {
      document
        .querySelectorAll(".robodemy-category-tab")
        .forEach((btn) => btn.classList.remove("active"));
      tab.classList.add("active");

      const filteredCourses =
        category === "All Courses"
          ? allCourses
          : allCourses.filter((course) =>
              course.course_category?.some((cat) => cat.name === category)
            );

      displayCourses(filteredCourses);
    });

    tabContainer.appendChild(tab);

    if (index === 0) tab.click(); // Auto-select "All Courses"
  });
}

async function getCoursePrice(courseId) {
  try {
    const response = await fetch(
      `https://robodemybd.com/wp-json/robodemy/v1/course-price/${courseId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch course price");
    }
    const priceData = await response.json();
    return priceData.price || "Price not available";
  } catch (error) {
    console.error("Error fetching course price:", error.message);
    return "Price not available";
  }
}

async function displayCourses(courses) {
  container.innerHTML = "";

  if (courses.length === 0) {
    container.innerHTML = "<p>No courses found.</p>";
    return;
  }

  for (const course of courses) {
    const allCategories = Array.isArray(course.course_category)
      ? course.course_category.map((cat) => cat.name).join(", ")
      : "Uncategorized";

    // Fetch course price
    const price = await getCoursePrice(course.ID); // Get the course price

    const card = document.createElement("div");
    card.className = "robodemy-course-card";
    card.innerHTML = `
      <img src="${course.thumbnail_url}" alt="${course.post_title}" class="robodemy-course-image">
      <p>${allCategories ? allCategories : "All"}</p>
      <h2>${course.post_title}</h2>
      <p class="course-price">${price}</p>
      <a href="https://robodemybd.com/courses/${course.post_name}" target="_blank">See Details</a>
    `;
    container.appendChild(card);
  }
}

fetchCourses();
