import { useRouter } from 'next/router';
import { useState } from 'react';

export interface ISearch {}

const Search: React.FC<ISearch> = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>('');

  return (
    <form
      className="form-control flex-col items-center gap-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/results?search=${searchTerm}`);
      }}
    >
      <input
        type="text"
        placeholder="Pick a course, ANY COURSE" 
        className="input input-bordered min-w-full "
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="space-x-3">
        <button type="submit" className="btn">
          SCHUBMIT
        </button>
      </div>
    </form>
  );
};

export default Search;