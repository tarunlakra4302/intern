exports.up = async function(knex) {
  // User accounts table
  await knex.schema.createTable('user_accounts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.enum('role', ['ADMIN', 'DRIVER']).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.enum('status', ['ACTIVE', 'INACTIVE']).defaultTo('ACTIVE');
    table.timestamp('last_login');
    table.timestamps(true, true);
  });

  // Drivers table
  await knex.schema.createTable('drivers', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('driver_code', 50).unique().notNullable(); // DRV-####
    table.uuid('user_id').unique().references('id').inTable('user_accounts').onDelete('CASCADE');
    table.string('full_name', 255).notNullable();
    table.string('phone', 50);
    table.string('license_number', 100);
    table.date('license_expiry');
    table.date('medical_expiry');
    table.enum('status', ['ACTIVE', 'INACTIVE']).defaultTo('ACTIVE');
    table.timestamps(true, true);
    table.index('user_id');
    table.index('status');
  });

  // Vehicles table
  await knex.schema.createTable('vehicles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('vehicle_code', 50).unique().notNullable(); // VEH-####
    table.string('rego_number', 50).unique().notNullable();
    table.string('make', 100);
    table.string('model', 100);
    table.date('rego_expiry');
    table.date('service_due_date');
    table.integer('km_to_next_service');
    table.enum('status', ['ACTIVE', 'INACTIVE']).defaultTo('ACTIVE');
    table.timestamps(true, true);
    table.index('status');
  });

  // Trailers table
  await knex.schema.createTable('trailers', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('trailer_code', 50).unique().notNullable(); // TRL-####
    table.string('rego_number', 50).unique().notNullable();
    table.enum('status', ['ACTIVE', 'INACTIVE']).defaultTo('ACTIVE');
    table.timestamps(true, true);
    table.index('status');
  });

  // Service records table
  await knex.schema.createTable('service_records', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('vehicle_id').references('id').inTable('vehicles').onDelete('CASCADE');
    table.date('serviced_at').notNullable();
    table.text('notes');
    table.date('next_service_date');
    table.integer('kms_at_service');
    table.timestamps(true, true);
    table.index('vehicle_id');
  });

  // Clients table
  await knex.schema.createTable('clients', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('client_code', 50).unique().notNullable(); // CLI-####
    table.string('name', 255).notNullable();
    table.string('abn', 50);
    table.string('email', 255);
    table.string('address_line', 255);
    table.string('suburb', 100);
    table.string('state', 50);
    table.string('postcode', 20);
    table.enum('status', ['ACTIVE', 'INACTIVE']).defaultTo('ACTIVE');
    table.timestamps(true, true);
    table.index('status');
  });

  // Products table
  await knex.schema.createTable('products', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('product_code', 50).unique().notNullable(); // PRD-####
    table.string('name', 255).notNullable();
    table.string('code', 100).unique();
    table.decimal('unit_price', 12, 2);
    table.text('description');
    table.enum('status', ['ACTIVE', 'INACTIVE']).defaultTo('ACTIVE');
    table.timestamps(true, true);
    table.index('status');
  });

  // Suppliers table
  await knex.schema.createTable('suppliers', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('business_name', 255).notNullable();
    table.string('contact_person', 255);
    table.string('phone', 50);
    table.string('address_line', 255);
    table.string('suburb', 100);
    table.string('state', 50);
    table.string('postcode', 20);
    table.jsonb('services');
    table.enum('status', ['ACTIVE', 'INACTIVE']).defaultTo('ACTIVE');
    table.timestamps(true, true);
    table.index('status');
  });

  // Shifts table
  await knex.schema.createTable('shifts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('shift_code', 50).unique().notNullable(); // SHF-YYYY-####
    table.uuid('driver_id').notNullable().references('id').inTable('drivers').onDelete('RESTRICT');
    table.timestamp('start_time', { useTz: true }).notNullable();
    table.timestamp('end_time', { useTz: true });
    table.enum('status', ['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED']).defaultTo('DRAFT');
    table.string('timezone', 50).defaultTo('Australia/Sydney');
    table.timestamps(true, true);
    table.index('driver_id');
    table.index('start_time');
    table.index('status');
  });

  // Jobs table
  await knex.schema.createTable('jobs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('job_code', 50).unique().notNullable(); // JOB-YYYY-####
    table.uuid('shift_id').notNullable().references('id').inTable('shifts').onDelete('RESTRICT');
    table.uuid('client_id').references('id').inTable('clients').onDelete('SET NULL');
    table.date('job_date').notNullable();
    table.string('reference_no', 100);
    table.text('pickup_address');
    table.text('delivery_address');
    table.decimal('distance_km', 8, 2);
    table.text('internal_notes');
    table.enum('status', ['DRAFT', 'ASSIGNED', 'COMPLETED', 'CANCELLED']).defaultTo('DRAFT');
    table.timestamps(true, true);
    table.index('shift_id');
    table.index('client_id');
    table.index('job_date');
    table.index('status');
  });

  // Job lines table
  await knex.schema.createTable('job_lines', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('job_id').notNullable().references('id').inTable('jobs').onDelete('CASCADE');
    table.time('pickup_time').notNullable();
    table.time('delivery_time').notNullable();
    table.uuid('product_id').references('id').inTable('products').onDelete('SET NULL');
    table.string('docket_no', 255);
    table.decimal('qty', 10, 2).defaultTo(1);
    table.uuid('driver_id').notNullable().references('id').inTable('drivers').onDelete('RESTRICT');
    table.uuid('vehicle_id').notNullable().references('id').inTable('vehicles').onDelete('RESTRICT');
    table.uuid('trailer_id').references('id').inTable('trailers').onDelete('SET NULL');
    table.timestamps(true, true);
    table.index('job_id');
    table.index('driver_id');
    table.index('vehicle_id');
  });

  // Attachments table
  await knex.schema.createTable('attachments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.enum('entity_type', ['JOB', 'JOB_LINE', 'SHIFT', 'FUEL', 'VEHICLE', 'DOCUMENT']).notNullable();
    table.uuid('entity_id').notNullable();
    table.enum('category', ['POD', 'WEIGHBRIDGE', 'JOB_PHOTO', 'FUEL_RECEIPT', 'SHIFT_PHOTO', 'DOCUMENT']).notNullable();
    table.string('filename', 255).notNullable();
    table.string('mime_type', 100).notNullable();
    table.integer('size_bytes').notNullable();
    table.binary('data').notNullable();
    table.uuid('uploaded_by').references('id').inTable('user_accounts').onDelete('SET NULL');
    table.timestamps(true, true);
    table.index(['entity_type', 'entity_id']);
    table.index('uploaded_by');
  });

  // Invoices table
  await knex.schema.createTable('invoices', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('job_id').unique().notNullable().references('id').inTable('jobs').onDelete('RESTRICT');
    table.uuid('client_id').notNullable().references('id').inTable('clients').onDelete('RESTRICT');
    table.string('number', 50).unique().notNullable(); // INV-YYYY-####
    table.date('issue_date').notNullable();
    table.enum('status', ['DRAFT', 'ISSUED', 'CANCELLED']).defaultTo('DRAFT');
    table.string('currency', 10).defaultTo('AUD');
    table.text('notes');
    table.text('bank_details_text');
    table.decimal('total_amount', 12, 2).notNullable();
    table.timestamp('email_sent_at', { useTz: true });
    table.binary('pdf');
    table.timestamps(true, true);
    table.index('job_id');
    table.index('client_id');
    table.index('status');
  });

  // Invoice items table
  await knex.schema.createTable('invoice_items', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('invoice_id').notNullable().references('id').inTable('invoices').onDelete('CASCADE');
    table.uuid('job_line_id').references('id').inTable('job_lines').onDelete('SET NULL');
    table.string('product_name_snap', 255);
    table.decimal('qty', 10, 2).notNullable();
    table.decimal('unit_price', 12, 2).notNullable();
    table.decimal('amount', 12, 2).notNullable();
    table.string('docket_no_snap', 255);
    table.timestamps(true, true);
    table.index('invoice_id');
  });

  // Fuel entries table
  await knex.schema.createTable('fuel_entries', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('driver_id').notNullable().references('id').inTable('drivers').onDelete('RESTRICT');
    table.uuid('vehicle_id').references('id').inTable('vehicles').onDelete('SET NULL');
    table.timestamp('filled_at', { useTz: true }).notNullable();
    table.decimal('liters', 10, 2).notNullable();
    table.decimal('amount', 12, 2).notNullable();
    table.integer('kms');
    table.string('location', 255);
    table.timestamps(true, true);
    table.index('driver_id');
    table.index('vehicle_id');
    table.index('filled_at');
  });

  // Staff expenses table
  await knex.schema.createTable('staff_expenses', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('driver_id').notNullable().references('id').inTable('drivers').onDelete('RESTRICT');
    table.string('title', 255).notNullable();
    table.decimal('amount', 12, 2).notNullable();
    table.date('occurred_at').notNullable();
    table.enum('status', ['PENDING', 'APPROVED']).defaultTo('PENDING');
    table.text('comment');
    table.timestamps(true, true);
    table.index('driver_id');
    table.index('status');
  });

  // Settings table (single row)
  await knex.schema.createTable('settings_org', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('company_name', 255);
    table.string('primary_color', 20);
    table.string('currency', 10).defaultTo('AUD');
    table.binary('logo');
    table.string('smtp_host', 255);
    table.integer('smtp_port');
    table.string('smtp_user', 255);
    table.string('smtp_pass', 255);
    table.string('gmaps_api_key', 255);
    table.timestamps(true, true);
  });

  // Password resets table
  await knex.schema.createTable('password_resets', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('user_accounts').onDelete('CASCADE');
    table.string('token', 255).unique().notNullable();
    table.timestamp('expires_at', { useTz: true }).notNullable();
    table.timestamp('used_at', { useTz: true });
    table.timestamps(true, true);
    table.index('user_id');
    table.index('token');
  });

  // Counters table for gap-tolerant ID generation
  await knex.schema.createTable('counters', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.integer('year').notNullable();
    table.enum('type', ['JOB', 'SHF', 'INV', 'VEH', 'DRV', 'CLI', 'PRD', 'TRL']).notNullable();
    table.integer('current').defaultTo(0);
    table.timestamps(true, true);
    table.unique(['year', 'type']);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('counters');
  await knex.schema.dropTableIfExists('password_resets');
  await knex.schema.dropTableIfExists('settings_org');
  await knex.schema.dropTableIfExists('staff_expenses');
  await knex.schema.dropTableIfExists('fuel_entries');
  await knex.schema.dropTableIfExists('invoice_items');
  await knex.schema.dropTableIfExists('invoices');
  await knex.schema.dropTableIfExists('attachments');
  await knex.schema.dropTableIfExists('job_lines');
  await knex.schema.dropTableIfExists('jobs');
  await knex.schema.dropTableIfExists('shifts');
  await knex.schema.dropTableIfExists('suppliers');
  await knex.schema.dropTableIfExists('products');
  await knex.schema.dropTableIfExists('clients');
  await knex.schema.dropTableIfExists('service_records');
  await knex.schema.dropTableIfExists('trailers');
  await knex.schema.dropTableIfExists('vehicles');
  await knex.schema.dropTableIfExists('drivers');
  await knex.schema.dropTableIfExists('user_accounts');
};