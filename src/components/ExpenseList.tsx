import {useMemo} from "react";
import {useBudget} from "../hooks/useBudget";
import ExpenseDetail from "./ExpenseDetail";

export default function ExpenseList() {
  const {state} = useBudget();
  const filterdExpenses = state.currentCategory ? state.expenses.filter(expense => expense.category === state.currentCategory) : state.expenses;

  const isEmpty = useMemo(() => filterdExpenses.length === 0, [filterdExpenses]);
  return (
    <div className="mt-10 bg-white shadow-lg rounded-lg p-10">
      {isEmpty ? (
        <p className="text-gray-600 text-2xl font-bold">No hay gastos</p>
      ) : (
        <>
          <p className="text-gray-600 text-2xl font-bold my-5 items-center">Listado de Gastos</p>
					{filterdExpenses.map( expense => (
						<ExpenseDetail 
							key={expense.id}
							expense={expense}
						/>
					))}
        </>
      )}
    </div>
  );
}
