SELECT employee.first_name, employee.last_name, roles.title AS Role, roles.salary, departments.department_name AS department, manager.first_name AS Manager, manager.last_name AS Name
FROM employees employee
INNER JOIN roles ON roles.id = employee.role_id 
INNER JOIN departments ON departments.id = roles.department_id
LEFT OUTER JOIN employees manager ON employee.manager_id = manager.id;