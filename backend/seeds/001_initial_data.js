/**
 * Fleet Management System - Initial Seed Data
 * Seeds default data for development and testing
 */

const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  // Calculate dates for future expiries
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  const licenseExpiry = oneYearFromNow.toISOString().split('T')[0];
  const medicalExpiry = oneYearFromNow.toISOString().split('T')[0];
  const currentYear = new Date().getFullYear();

  // ============================================================================
  // Step 1: Delete existing data in reverse order of dependencies
  // ============================================================================

  console.log('Deleting existing data...');

  // Delete dependent tables first
  await knex('invoice_items').del();
  await knex('invoices').del();
  await knex('staff_expenses').del();
  await knex('fuel_entries').del();
  await knex('attachments').del();
  await knex('job_lines').del();
  await knex('jobs').del();
  await knex('shifts').del();

  // Delete master data tables
  await knex('suppliers').del();
  await knex('products').del();
  await knex('clients').del();
  await knex('trailers').del();
  await knex('vehicles').del();
  await knex('drivers').del();
  await knex('counters').del();
  await knex('documents').del();
  await knex('users').del();

  // Settings will be updated, not deleted
  await knex('settings').del();

  console.log('Existing data deleted.');

  // ============================================================================
  // Step 2: Insert Settings (default company settings)
  // ============================================================================

  console.log('Inserting settings...');

  await knex('settings').insert({
    company_name: 'Fleet Management System',
    primary_color: '#3b82f6',
    currency_symbol: '$',
    smtp_host: null,
    smtp_port: null,
    smtp_user: null,
    smtp_password: null,
    smtp_from: null,
    maps_api_key: null
  });

  console.log('Settings inserted.');

  // ============================================================================
  // Step 3: Insert Users (Admin and Driver)
  // ============================================================================

  console.log('Inserting users...');

  // Hash passwords using bcrypt
  const adminPasswordHash = bcrypt.hashSync('Admin123!', 10);
  const driverPasswordHash = bcrypt.hashSync('Driver123!', 10);

  // Insert Admin User
  const [adminUser] = await knex('users')
    .insert({
      email: 'admin@fleetmanager.com',
      password_hash: adminPasswordHash,
      role: 'ADMIN',
      name: 'System Administrator',
      phone: '+61400000000',
      status: 'ACTIVE'
    })
    .returning('*');

  console.log(`Admin user created: ${adminUser.email} (ID: ${adminUser.id})`);

  // Insert Driver User
  const [driverUser] = await knex('users')
    .insert({
      email: 'driver@fleetmanager.com',
      password_hash: driverPasswordHash,
      role: 'DRIVER',
      name: 'John Smith',
      phone: '+61400000001',
      status: 'ACTIVE'
    })
    .returning('*');

  console.log(`Driver user created: ${driverUser.email} (ID: ${driverUser.id})`);

  // ============================================================================
  // Step 4: Insert Driver Profile
  // ============================================================================

  console.log('Inserting driver profile...');

  const [driverProfile] = await knex('drivers')
    .insert({
      user_id: driverUser.id,
      license_no: 'NSW12345678',
      license_expiry: licenseExpiry,
      medical_expiry: medicalExpiry,
      address: '123 Driver Street, Sydney NSW 2000',
      hire_date: knex.fn.now(),
      emergency_contact_name: 'Jane Smith',
      emergency_contact_phone: '+61400000002',
      total_hours: 0,
      total_km: 0
    })
    .returning('*');

  console.log(`Driver profile created: ${driverProfile.license_no} (ID: ${driverProfile.id})`);

  // ============================================================================
  // Step 5: Insert Vehicles
  // ============================================================================

  console.log('Inserting vehicles...');

  const vehicles = await knex('vehicles')
    .insert([
      {
        veh_code: 'VEH-0001',
        rego: 'ABC123',
        make: 'Toyota',
        model: 'Hilux',
        year: 2022,
        rego_expiry: licenseExpiry,
        service_due: licenseExpiry,
        km_to_next: 5000,
        current_km: 45000,
        status: 'ACTIVE'
      },
      {
        veh_code: 'VEH-0002',
        rego: 'DEF456',
        make: 'Isuzu',
        model: 'NPR',
        year: 2021,
        rego_expiry: licenseExpiry,
        service_due: licenseExpiry,
        km_to_next: 7500,
        current_km: 82500,
        status: 'ACTIVE'
      }
    ])
    .returning('*');

  console.log(`Vehicles inserted: ${vehicles.length} vehicles`);

  // ============================================================================
  // Step 6: Insert Trailers
  // ============================================================================

  console.log('Inserting trailers...');

  const [trailer] = await knex('trailers')
    .insert({
      trailer_code: 'TRL-0001',
      rego: 'TRL123',
      type: 'Flatbed',
      rego_expiry: licenseExpiry,
      status: 'ACTIVE'
    })
    .returning('*');

  console.log(`Trailer inserted: ${trailer.trailer_code} (ID: ${trailer.id})`);

  // ============================================================================
  // Step 7: Insert Clients
  // ============================================================================

  console.log('Inserting clients...');

  const [client] = await knex('clients')
    .insert({
      code: 'CLI-0001',
      name: 'Acme Construction',
      abn: '12345678901',
      email: 'billing@acme.com',
      contact_person: 'Robert Johnson',
      phone: '+61298765432',
      address_line: '456 Construction Ave',
      suburb: 'Parramatta',
      state: 'NSW',
      postcode: '2150',
      payment_terms: 'Net 30',
      status: 'ACTIVE'
    })
    .returning('*');

  console.log(`Client inserted: ${client.code} - ${client.name} (ID: ${client.id})`);

  // ============================================================================
  // Step 8: Insert Products
  // ============================================================================

  console.log('Inserting products...');

  const [product] = await knex('products')
    .insert({
      code: 'PRD-0001',
      name: 'Sand',
      description: 'Fine building sand',
      unit_price: 50.00,
      unit: 'tonne',
      status: 'ACTIVE'
    })
    .returning('*');

  console.log(`Product inserted: ${product.code} - ${product.name} (ID: ${product.id})`);

  // ============================================================================
  // Step 9: Insert Suppliers
  // ============================================================================

  console.log('Inserting suppliers...');

  const [supplier] = await knex('suppliers')
    .insert({
      business_name: 'ABC Supplies',
      contact_name: 'Jane Doe',
      phone: '+61287654321',
      email: 'jane@abcsupplies.com.au',
      address_line: '789 Supply Road',
      suburb: 'Blacktown',
      state: 'NSW',
      postcode: '2148',
      services: JSON.stringify(['Fuel', 'Maintenance', 'Parts']),
      status: 'ACTIVE'
    })
    .returning('*');

  console.log(`Supplier inserted: ${supplier.business_name} (ID: ${supplier.id})`);

  // ============================================================================
  // Step 10: Insert Counters (initialize counters for current year)
  // ============================================================================

  console.log('Inserting counters...');

  await knex('counters').insert([
    { year: currentYear, type: 'JOB', current: 0 },
    { year: currentYear, type: 'SHF', current: 0 },
    { year: currentYear, type: 'INV', current: 0 },
    { year: currentYear, type: 'VEH', current: 2 },
    { year: currentYear, type: 'DRV', current: 1 },
    { year: currentYear, type: 'CLI', current: 1 },
    { year: currentYear, type: 'PRD', current: 1 },
    { year: currentYear, type: 'TRL', current: 1 }
  ]);

  console.log(`Counters initialized for year ${currentYear}`);

  // ============================================================================
  // Summary
  // ============================================================================

  console.log('\n========================================');
  console.log('Seed completed successfully!');
  console.log('========================================');
  console.log('\nCreated accounts:');
  console.log(`  Admin: admin@fleetmanager.com / Admin123!`);
  console.log(`  Driver: driver@fleetmanager.com / Driver123!`);
  console.log('\nSeeded data:');
  console.log(`  - 1 Settings record`);
  console.log(`  - 2 Users (1 Admin, 1 Driver)`);
  console.log(`  - 1 Driver profile`);
  console.log(`  - ${vehicles.length} Vehicles`);
  console.log(`  - 1 Trailer`);
  console.log(`  - 1 Client`);
  console.log(`  - 1 Product`);
  console.log(`  - 1 Supplier`);
  console.log(`  - 8 Counter types for ${currentYear}`);
  console.log('========================================\n');
};