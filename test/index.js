var chai      = require('chai'),
    chai_http = require('chai-http');

var expect = chai.expect;

var app    = require('../app');

var Item   = require('../app/shopping-list/item.js');

chai.use(chai_http);

describe('Shopping List', function() {
  beforeEach(function(done) {
    Item.remove({}, function(err, result){
      var item = new Item({ name: 'Oranges' });
      item.save(function(err, updatedItem){
        done();
      });
    });
  });

  afterEach(function(done) {
    Item.remove({}, function(err, result){
      done();
    });
  });

  it('should list items on get', function(done){
    chai
    .request(app)
    .get('/api/all')
    .end(function (err, res) {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res.body).to.have.length(1)
      done();
    });
  });

  it('should add an item on post', function(done){
    chai
    .request(app)
    .post('/')
    .send({ name: 'Apples' })
    .end(function (err, res){
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      Item.count({}, function(err, count){
        expect(count).to.equal(2);
        done();
      });
    });
  });

  it('should edit an item on put', function(done){
    Item.findOne({}, function(err, item){
      chai
      .request(app)
      .post('/' + item._id)
      .send({ name: 'Apples' })
      .end(function (err, res){
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.name).to.not.equal(item.name);
        done();
      })
    });
  });

  it('should delete an item on delete', function(done){
    Item.findOne({}, function(err, item){
      chai
      .request(app)
      .delete('/' + item._id)
      .end(function (err, res){
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        Item.count({}, function(err, count){
          expect(count).to.equal(0);
          done();
        });
      })
    });
  });
});
