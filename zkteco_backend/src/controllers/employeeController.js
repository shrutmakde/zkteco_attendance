const Employee = require('../models/employee/Employee');

const employeeController = {
  // Get all employees
  async getAllEmployees(req, res) {
    try {
      const employees = await Employee.findAll();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get employee by ID
  async getEmployeeById(req, res) {
    try {
      const employee = await Employee.findByPk(req.params.id);
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create new employee
  async createEmployee(req, res) {
    try {
      const employee = await Employee.create(req.body);
      res.status(201).json(employee);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update employee
  async updateEmployee(req, res) {
    try {
      const employee = await Employee.findByPk(req.params.id);
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      await employee.update(req.body);
      res.json(employee);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete employee
  async deleteEmployee(req, res) {
    try {
      const employee = await Employee.findByPk(req.params.id);
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      await employee.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = employeeController; 