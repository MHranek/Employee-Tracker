SELECT employees.first_name, employees.last_name, roles.title AS Role, roles.salary, departments.department_name AS Department 
FROM employees 
INNER JOIN roles ON roles.id = employees.role_id 
INNER JOIN departments ON departments.id = roles.department_id;