import React from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaUserGraduate,
  FaDownload,
} from "react-icons/fa";

const CollegeStudents = ({ students, updatePlacementStatus, loading }) => {
  const downloadCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Skills",
      "Graduation Year",
      "Placement Status",
      "Company",
    ];

    const rows = students.map((student) => [
      student.name || "N/A",
      student.email || "N/A",
      student.skills?.join(", ") || "N/A",
      student.graduationYear || "N/A",
      student.isPlaced ? "Placed" : "Unplaced",
      student.company || "N/A",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((field) => `"${field}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "college_students.csv");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaUserGraduate className="text-blue-600" />
            Students
          </h1>
          <p className="text-gray-600">
            Manage your college's student records efficiently
          </p>
        </div>
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <FaDownload />
          Download CSV
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-primary-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skills
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Graduation Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.name}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.email}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {student.skills?.slice(0, 2).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}

                      {student.skills?.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{student.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.graduationYear || "N/A"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${
                        student.isPlaced
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {student.isPlaced ? <FaCheckCircle /> : <FaTimesCircle />}

                      {student.isPlaced ? "Placed" : "Unplaced"}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        const isPlaced = !student.isPlaced;
                        const placedCompany = isPlaced
                          ? prompt("Enter company name:")
                          : "";

                        if (isPlaced && placedCompany) {
                          updatePlacementStatus(
                            student._id,
                            isPlaced,
                            placedCompany
                          );
                        } else if (!isPlaced) {
                          updatePlacementStatus(student._id, isPlaced);
                        }
                      }}
                      className={`px-3 py-1 text-xs rounded font-medium transition ${
                        student.isPlaced
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {student.isPlaced ? "Mark Unplaced" : "Mark Placed"}
                    </button>
                  </td>
                </tr>
              ))}

              {students.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CollegeStudents;
