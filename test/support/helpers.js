var chai = require('chai'),
    chai_http = require('chai-http');

var should = chai.should();
chai.use(chai_http);

require('dotenv').config({ path: '.env.test' });
