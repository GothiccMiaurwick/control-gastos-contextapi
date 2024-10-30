import {useState, ChangeEvent, useEffect} from "react";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-date-picker";
import type {DraftExpense, Value} from "../types";
import {useBudget} from "../hooks/useBudget";
import {categories} from "../data/categories";
import ErrorMessage from "./ErrorMessage";

export default function ExpenseForm() {
  const [expense, setExpense] = useState<DraftExpense>({
    amount: 0,
    expenseName: "",
    category: "",
    date: new Date(),
  });

  const [error, setError] = useState("");
  const [ previousAmount, setPreviousAmount ] = useState(0)
  const {dispatch, state, remainingBudget} = useBudget();

  useEffect(() => {
    if(state.editingId){ 
      const editingExpense = state.expenses.filter(currentExpense => currentExpense.id === state.editingId)[0]
      setExpense(editingExpense)
      setPreviousAmount(editingExpense.amount)
    }
  },[state.editingId])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const {name, value} = e.target;
    const isAmountField = ["amount"].includes(name);
    setExpense({
      ...expense,
      [name]: isAmountField ? Number(value) : value,
    });
  };

  const handleChangeDate = (value: Value) => {
    setExpense({
      ...expense,
      date: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // validar
    if (Object.values(expense).includes("")) {
      setError("Complete todos los campos");
      return;
    }

    // verificar que el gasto no supere el presupuesto
    if ((expense.amount - previousAmount) > remainingBudget) {
      setError("El gasto no puede exceder el presupuesto");
      return;
    }

    // agregar o actualizar el gasto
    if(state.editingId){
      dispatch({type: "update-expense", payload: {expense: {id: state.editingId, ...expense}} });
    }
    else{
      dispatch({type: "add-expense", payload: {expense} });
    }
    // reiniciar state
    setExpense({
      amount: 0,
      expenseName: "",
      category: "",
      date: new Date(),
    });
    setPreviousAmount(0)
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">
        {state.editingId ? "Actualizar gasto" : "Nuevo gasto"} 
      </legend>

      {error && <ErrorMessage> {error} </ErrorMessage>}

      <div className="flex flex-col gap-2">
        <label htmlFor="expenseName" className="text-xl">
          Nombre Gasto:
        </label>
        <input
          type="text"
          id="expenseName"
          placeholder="Añade el nombre de el gasto"
          className="bg-slate-100 p-2"
          name="expenseName"
          value={expense.expenseName}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="expenseName" className="text-xl">
          Cantidad:
        </label>
        <input
          type="amount"
          id="amount"
          placeholder="Añade el nombre de el gasto: ej. 300"
          className="bg-slate-100 p-2"
          name="amount"
          value={expense.amount}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="text-xl">
          Categoria:
        </label>
        <select
          id="category"
          className="bg-slate-100 p-2"
          name="category"
          value={expense.category}
          onChange={handleChange}
        >
          <option value="">-- seleccione --</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="expenseName" className="text-xl">
          Fecha Gasto:
        </label>
        <DatePicker
          className="bg-pink-100 p-2 border-0"
          value={expense.date}
          onChange={handleChangeDate}
        />
      </div>
      <input
        type="submit"
        className="bg-blue-600 cursosr-pointer w-full text-white uppercase font-bold rounded-lg"
        defaultValue={state.editingId ? "Guardar cambios" : "Guardar gasto"} 

      />
    </form>
  );
}
