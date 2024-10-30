import {useMemo, useState} from "react";
import {useBudget} from "../hooks/useBudget";

export default function BudgetForm() {
  const [budget, setBudget] = useState(0);
  const {dispatch} = useBudget();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudget(e.target.valueAsNumber);
  };

  const isValid = useMemo(() => {
     return isNaN(budget) || budget <= 0;
  }, [budget]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch({type: 'add-budget', payload: {budget} })
  }

  return (
    <form className="space-y-5" onSubmit={ handleSubmit }>
      <div className="flex flex-col space-y-5 ">
        <label
          className="text-4xl text-blue-600 font-bold text-center"
          htmlFor="budget"
        >
          Definir presupuesto
        </label>
        <input
          className="w-full bg-white border-gray-200 p-2"
          type="number"
          placeholder="Define tu presupuesto"
          name="budget"
          id="badget"
          value={budget}
          onChange={handleChange}
        />
      </div>

      <input
        className="bg-blue-600 hover:bg-blue-700 cursor-pointer w-full p-2 text-white font-black uppercase disabled:opacity-40"
        type="submit"
        value="Definir Presupuesto"
        disabled={isValid}
      />
    </form>
  );
}
