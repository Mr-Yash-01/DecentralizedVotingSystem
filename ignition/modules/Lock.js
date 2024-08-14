const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const initialAdmin = 'yash@gmail.com';
const initialAdminPassword = 'password';

module.exports = buildModule("LockModule", (m) => {
  const adminId = m.getParameter("initialAdminId", initialAdmin);
  const adminPassword = m.getParameter("initialAdminPassword", initialAdminPassword);

  const lock = m.contract("Lock", [adminId, adminPassword], {});

  return { lock };
});
