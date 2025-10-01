exports.up = function(knex) {
  return knex.schema
    // Shifts table
    .createTable('shifts', table => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('driver_id').notNullable().references('id').inTable('drivers');
      table.timestamp('start_time').notNullable();
      table.timestamp('end_time');
      table.enum('status', ['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED']).defaultTo('DRAFT');
      table.string('timezone', 50).defaultTo('UTC');
      table.timestamps(true, true);
      table.index(['driver_id', 'start_time']);
      table.index('status');
    })
    // Jobs table
    .createTable('jobs', table => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('shift_id').notNullable().references('id').inTable('shifts');
      table.uuid('client_id').references('id').inTable('clients');
      table.date('job_date').notNullable();
      table.string('reference_no', 100);
      table.text('pickup_address');
      table.text('delivery_address');
      table.decimal('distance_km', 8, 2);
      table.text('internal_notes');
      table.enum('status', ['DRAFT', 'ASSIGNED', 'COMPLETED', 'CANCELLED']).defaultTo('DRAFT');
      table.timestamps(true, true);
      table.index(['shift_id', 'job_date']);
      table.index('client_id');
      table.index('status');
    })
    // Job lines table
    .createTable('job_lines', table => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('job_id').notNullable().references('id').inTable('jobs').onDelete('CASCADE');
      table.time('pickup_time').notNullable();
      table.time('delivery_time').notNullable();
      table.uuid('product_id').references('id').inTable('products');
      table.string('docket_no', 200);
      table.decimal('qty', 10, 2).defaultTo(1);
      table.uuid('driver_id').notNullable().references('id').inTable('drivers');
      table.uuid('vehicle_id').notNullable().references('id').inTable('vehicles');
      table.uuid('trailer_id').references('id').inTable('trailers');
      table.timestamps(true, true);
      table.index('job_id');
      table.index(['driver_id', 'pickup_time', 'delivery_time']);
      table.index(['vehicle_id', 'pickup_time', 'delivery_time']);
    })
    // Invoices table
    .createTable('invoices', table => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('job_id').unique().notNullable().references('id').inTable('jobs');
      table.uuid('client_id').notNullable().references('id').inTable('clients');
      table.string('number', 50).unique().notNullable();
      table.date('issue_date').notNullable();
      table.enum('status', ['DRAFT', 'ISSUED', 'CANCELLED']).defaultTo('DRAFT');
      table.string('currency', 10).defaultTo('AUD');
      table.text('notes');
      table.text('bank_details_text');
      table.decimal('total_amount', 12, 2).notNullable();
      table.timestamp('email_sent_at');
      table.binary('pdf');
      table.timestamps(true, true);
      table.index('client_id');
      table.index('status');
    })
    // Invoice items table
    .createTable('invoice_items', table => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('invoice_id').notNullable().references('id').inTable('invoices').onDelete('CASCADE');
      table.uuid('job_line_id').references('id').inTable('job_lines');
      table.string('product_name_snap', 200);
      table.decimal('qty', 10, 2).notNullable();
      table.decimal('unit_price', 12, 2).notNullable();
      table.decimal('amount', 12, 2).notNullable();
      table.string('docket_no_snap', 200);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.index('invoice_id');
    })
    // Attachments table
    .createTable('attachments', table => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.enum('entity_type', ['JOB', 'JOB_LINE', 'SHIFT', 'FUEL', 'VEHICLE', 'DOCUMENT']).notNullable();
      table.uuid('entity_id').notNullable();
      table.enum('category', ['POD', 'WEIGHBRIDGE', 'JOB_PHOTO', 'FUEL_RECEIPT', 'SHIFT_PHOTO', 'DOCUMENT']).notNullable();
      table.string('filename', 255).notNullable();
      table.string('mime_type', 100).notNullable();
      table.integer('size_bytes').notNullable();
      table.binary('data').notNullable();
      table.uuid('uploaded_by').references('id').inTable('user_accounts');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.index(['entity_type', 'entity_id']);
      table.index('category');
    })
    // Service records table
    .createTable('service_records', table => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('vehicle_id').notNullable().references('id').inTable('vehicles');
      table.date('serviced_at').notNullable();
      table.text('notes');
      table.date('next_service_date');
      table.integer('kms_at_service');
      table.timestamps(true, true);
      table.index(['vehicle_id', 'serviced_at']);
    })
    // Password resets table
    .createTable('password_resets', table => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('user_id').notNullable().references('id').inTable('user_accounts');
      table.string('token', 255).unique().notNullable();
      table.timestamp('expires_at').notNullable();
      table.timestamp('used_at');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.index('token');
      table.index(['user_id', 'expires_at']);
    })
    // Settings org table
    .createTable('settings_org', table => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('company_name', 200);
      table.string('primary_color', 20);
      table.string('currency', 10).defaultTo('AUD');
      table.binary('logo');
      table.string('smtp_host', 200);
      table.integer('smtp_port');
      table.string('smtp_user', 200);
      table.string('smtp_pass', 200);
      table.string('gmaps_api_key', 200);
      table.text('bank_details_text');
      table.timestamps(true, true);
    })
    // Counters table for ID generation
    .createTable('counters', table => {
      table.increments('id').primary();
      table.integer('year').notNullable();
      table.string('type', 10).notNullable();
      table.integer('current').notNullable().defaultTo(0);
      table.unique(['year', 'type']);
      table.index(['year', 'type']);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('password_resets')
    .dropTableIfExists('service_records')
    .dropTableIfExists('attachments')
    .dropTableIfExists('invoice_items')
    .dropTableIfExists('invoices')
    .dropTableIfExists('job_lines')
    .dropTableIfExists('jobs')
    .dropTableIfExists('shifts')
    .dropTableIfExists('settings_org')
    .dropTableIfExists('counters');
};