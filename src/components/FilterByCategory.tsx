import { useBudget } from "../hooks/useBudget";
import { categories } from "../data/categories";

export default function FilterByCategory() { 
  const { dispatch } = useBudget();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({type: 'add-filter-category', payload: {id: e.target.value}  })
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-10">
      <form className=" flex flex-col md:flex-row md:items-center gap-5">
        <label htmlFor="category">Filtrar gastos </label>
        <select
          name="category"
          id="category"
          className="bg-slate-100 p-3 flex-1 rounded"
          onChange={handleChange}
        >
          <option value="">-- Toda las categorias --</option>
          {categories.map((categoty) => (
            <option value={categoty.id} key={categoty.id}>
              {categoty.name}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
}
