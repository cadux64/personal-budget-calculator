import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState(0);
  const [expenseForm, setExpenseForm] = useState({
    name: '',
    amount: '',
    category: 'alimentacao'
  });

  const categories = ['alimentacao', 'transporte', 'moradia', 'entretenimento', 'saude', 'utilidades', 'outros'];
  
  const categoryLabels = {
    'alimentacao': 'Alimentação',
    'transporte': 'Transporte',
    'moradia': 'Moradia',
    'entretenimento': 'Entretenimento',
    'saude': 'Saúde',
    'utilidades': 'Utilidades',
    'outros': 'Outros'
  };

  useEffect(() => {
    const savedExpenses = localStorage.getItem('budgetExpenses');
    const savedIncome = localStorage.getItem('budgetIncome');
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    if (savedIncome) {
      setIncome(parseFloat(savedIncome));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('budgetExpenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('budgetIncome', income.toString());
  }, [income]);

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (expenseForm.name && expenseForm.amount) {
      const newExpense = {
        id: Date.now(),
        name: expenseForm.name,
        amount: parseFloat(expenseForm.amount),
        category: expenseForm.category,
        date: new Date().toLocaleDateString('pt-BR')
      };
      setExpenses([...expenses, newExpense]);
      setExpenseForm({ name: '', amount: '', category: 'alimentacao' });
    }
  };

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setExpenseForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
  const remainingBudget = income - totalExpenses;

  const expensesByCategory = categories.map(category => ({
    category,
    total: expenses
      .filter(expense => expense.category === category)
      .reduce((total, expense) => total + expense.amount, 0)
  })).filter(item => item.total > 0);

  return (
    <div className="App">
      <header className="app-header">
        <h1>Calculadora de Orçamento Pessoal</h1>
        <p>Acompanhe seus gastos mensais e gerencie seu orçamento</p>
      </header>

      <main className="main-content">
        <div className="income-section">
          <h2>Renda Mensal</h2>
          <div className="income-input">
            <label htmlFor="income">Digite sua renda mensal:</label>
            <input
              type="number"
              id="income"
              value={income || ''}
              onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
              placeholder="0,00"
              step="0.01"
            />
          </div>
        </div>

        <div className="expense-form-section">
          <h2>Adicionar Gasto</h2>
          <form onSubmit={handleExpenseSubmit} className="expense-form">
            <div className="form-group">
              <label htmlFor="name">Nome do Gasto:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={expenseForm.name}
                onChange={handleExpenseChange}
                placeholder="Digite o nome do gasto"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="amount">Valor:</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={expenseForm.amount}
                onChange={handleExpenseChange}
                placeholder="0,00"
                step="0.01"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Categoria:</label>
              <select
                id="category"
                name="category"
                value={expenseForm.category}
                onChange={handleExpenseChange}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {categoryLabels[category]}
                  </option>
                ))}
              </select>
            </div>
            
            <button type="submit" className="add-expense-btn">Adicionar Gasto</button>
          </form>
        </div>

        <div className="overview-section">
          <h2>Resumo Mensal</h2>
          <div className="overview-cards">
            <div className="overview-card income-card">
              <h3>Renda</h3>
              <p className="amount">R$ {income.toFixed(2).replace('.', ',')}</p>
            </div>
            
            <div className="overview-card expenses-card">
              <h3>Total de Gastos</h3>
              <p className="amount">R$ {totalExpenses.toFixed(2).replace('.', ',')}</p>
            </div>
            
            <div className={`overview-card balance-card ${remainingBudget < 0 ? 'negative' : 'positive'}`}>
              <h3>Orçamento Restante</h3>
              <p className="amount">R$ {remainingBudget.toFixed(2).replace('.', ',')}</p>
            </div>
          </div>
        </div>

        <div className="expenses-list-section">
          <h2>Lista de Gastos</h2>
          {expenses.length === 0 ? (
            <p className="no-expenses">Nenhum gasto adicionado ainda.</p>
          ) : (
            <div className="expenses-list">
              {expenses.map(expense => (
                <div key={expense.id} className="expense-item">
                  <div className="expense-info">
                    <h4>{expense.name}</h4>
                    <p className="expense-category">{expense.category}</p>
                    <p className="expense-date">{expense.date}</p>
                  </div>
                  <div className="expense-amount">
                    <span>R$ {expense.amount.toFixed(2).replace('.', ',')}</span>
                    <button 
                      onClick={() => deleteExpense(expense.id)}
                      className="delete-btn"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {expensesByCategory.length > 0 && (
          <div className="category-breakdown">
            <h2>Gastos por Categoria</h2>
            <div className="category-list">
              {expensesByCategory.map(item => (
                <div key={item.category} className="category-item">
                  <span className="category-name">
                    {categoryLabels[item.category]}
                  </span>
                  <span className="category-amount">R$ {item.total.toFixed(2).replace('.', ',')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;