import FadeIn from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import debounce from "lodash/debounce";
import { Plus, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateTag: () => void;
  debounceTime?: number;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onCreateTag,
  debounceTime = 300,
}) => {
  const [inputValue, setInputValue] = useState(searchQuery);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearchChange(value);
    }, debounceTime),
    [onSearchChange, debounceTime]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <FadeIn>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tags..."
            className="pl-9 w-full"
            value={inputValue}
            onChange={handleInputChange}
          />
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <Button onClick={onCreateTag}>
          <Plus className="mr-1 h-4 w-4" /> New Tag
        </Button>
      </FadeIn>
    </div>
  );
};

export default SearchHeader;
