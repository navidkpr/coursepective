import { useRouter } from 'next/router';
import { useState } from 'react';
import CourseService, { Course } from '../services/course.service';

export interface ISearch {}

const Search: React.FC<ISearch> = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>('');

  async function searchForCourse() {
    const courses: Course[] = await new CourseService().searchForCourses(searchTerm)
    console.log(courses)
  }

  return (
    <form
      className="flex flex-col items-center gap-y-5 min-w-full"
      onSubmit={(e) => {
        e.preventDefault();
        searchForCourse()
        router.push(`/results?search=${searchTerm}`);
      }}
    >
      <h1 className="text-7xl flex font-bold">Coursepective</h1>
      <input
        type="text"
        placeholder="Search for a course..." 
        className="input input-bordered min-w-full "
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="space-x-3">
        <button type="submit" className="btn">
          Search
        </button>
      </div>
    </form>
  );
};

export default Search;