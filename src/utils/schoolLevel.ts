/**
 * School level types
 * - Preprep: Pre-nursery to Year 2
 * - Prep: Year 3 to Year 8
 * - Senior: Year 9 to Year 13
 */
export type SchoolLevel = "preprep" | "prep" | "senior"

/**
 * Maps a student's grade/year to the appropriate school level
 * @param grade - The student's grade (e.g., "Pre-nursery", "Nursery", "Reception", "Year 1", "Year 10")
 * @returns The corresponding school level
 */
export function getSchoolLevelFromGrade(grade: string): SchoolLevel {
  // Preprep level: Pre-nursery to Year 2
  if (grade === "Pre-nursery" || grade === "Nursery" || grade === "Reception" || grade === "Year 1" || grade === "Year 2") {
    return "preprep"
  }

  // Extract year number from grade string (e.g., "Year 5" -> 5)
  const yearNumber = parseInt(grade.replace("Year ", ""))

  // Prep level: Year 3 to Year 8
  if (yearNumber >= 3 && yearNumber <= 8) {
    return "prep"
  }

  // Senior level: Year 9 to Year 13
  return "senior"
}

/**
 * Gets the display label for a school level
 * @param level - The school level
 * @returns The display label
 */
export function getSchoolLevelLabel(level: SchoolLevel): string {
  const labels: Record<SchoolLevel, string> = {
    preprep: "Preprep",
    prep: "Prep",
    senior: "Senior"
  }
  return labels[level]
}

/**
 * Gets the year range for a school level
 * @param level - The school level
 * @returns A string describing the year range
 */
export function getSchoolLevelRange(level: SchoolLevel): string {
  const ranges: Record<SchoolLevel, string> = {
    preprep: "Pre-nursery to Year 2",
    prep: "Year 3 to Year 8",
    senior: "Year 9 to Year 13"
  }
  return ranges[level]
}
