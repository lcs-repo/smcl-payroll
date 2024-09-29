"use client";

import React, { useState } from 'react';
import { Employee } from '../types/types';

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState<Employee>({
    id: Date.now(),
    name: '',
    role: '',
    salary: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({
      ...prev,
      [name]: name === 'salary' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setEmployees([...employees, newEmployee]);
    setNewEmployee({ id: Date.now(), name: '', role: '', salary: 0 });
  };

  return (
    <div>
      <h2>Add Employee</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={newEmployee.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Role:
          <input
            type="text"
            name="role"
            value={newEmployee.role}
            onChange={handleChange}
          />
        </label>
        <label>
          Salary:
          <input
            type="number"
            name="salary"
            value={newEmployee.salary}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Add Employee</button>
      </form>
      <div>
        <h3>Current Employees</h3>
        <ul>
          {employees.map((emp) => (
            <li key={emp.id}>{emp.name} - {emp.role} - ${emp.salary}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Employees;
