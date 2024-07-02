const chaiHttp = require('chai-http')
const chai = require('chai')
const assert = chai.assert
const server = require('../server')
let issue

chai.use(chaiHttp)

suite('Functional Tests', function () {
  test('Create an issue with every field: POST request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .post('/api/issues/test')
      .send({
        issue_title: 'title 1',
        issue_text: 'text 1',
        created_by: 'author 1',
        assigned_to: 'author 2',
        status_text: 'status 2',
      })
      .end((err, res) => {
        issue = res.body
        assert.equal(res.status, 200, 'response status should be 200')
        assert.equal(res.body.issue_title, 'title 1')
        assert.equal(res.body.issue_text, 'text 1')
        assert.equal(res.body.created_by, 'author 1')
        assert.equal(res.body.assigned_to, 'author 2')
        assert.equal(res.body.status_text, 'status 2')
        done()
      })
  })
  test('Create an issue with only required fields: POST request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .post('/api/issues/test')
      .send({
        issue_title: 'title 1',
        issue_text: 'text 2',
        created_by: 'author 2',
        assigned_to: '',
        status_text: '',
      })
      .end((err, res) => {
        assert.equal(res.status, 200, 'response status should be 200')
        assert.equal(res.body.issue_title, 'title 1')
        assert.equal(res.body.issue_text, 'text 2')
        assert.equal(res.body.created_by, 'author 2')
        done()
      })
  })
  test('Create an issue with missing required fields: POST request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .post('/api/issues/test')
      .send({
        issue_title: '',
        issue_text: '',
        created_by: 'a',
        assigned_to: 'doguozcan',
        status_text: '',
      })
      .end((err, res) => {
        assert.equal(res.status, 200, 'response status should be 200')
        assert.equal(res.body.error, 'required field(s) missing')
        done()
      })
  })
  test('View issues on a project: GET request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .get('/api/issues/test')
      .end((err, res) => {
        assert.equal(res.status, 200, 'response status should be 200')
        done()
      })
  })
  test('View issues on a project with one filter: GET request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .get('/api/issues/test')
      .query({ _id: issue._id })
      .end((err, res) => {
        assert.equal(res.status, 200, 'response status should be 200')
        assert.equal(res.body.at(0).issue_title, issue.issue_title)
        assert.equal(res.body.at(0).issue_text, issue.issue_text)
        assert.equal(res.body.at(0).created_by, issue.created_by)
        done()
      })
  })
  test('View issues on a project with multiple filters: GET request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .get('/api/issues/test')
      .query({ issue_title: 'title 1', issue_text: 'text 2' })
      .end((err, res) => {
        assert.equal(res.status, 200, 'response status should be 200')
        assert.equal(res.body.at(0).issue_title, 'title 1')
        assert.equal(res.body.at(0).issue_text, 'text 2')
        assert.equal(res.body.at(0).created_by, 'author 2')
        done()
      })
  })
  test('Update one field on an issue: PUT request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .put('/api/issues/test')
      .send({
        _id: issue._id,
        issue_title: 'updated title',
      })
      .end((err, res) => {
        assert.equal(res.status, 200, 'response status should be 200')
        assert.equal(res.body.result, 'successfully updated')
        assert.equal(res.body._id, issue._id)
        done()
      })
  })
  test('Update multiple fields on an issue: PUT request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .put('/api/issues/test')
      .send({
        _id: issue._id,
        issue_title: 'updated title',
        issue_text: 'updated text',
      })
      .end((err, res) => {
        assert.equal(res.status, 200, 'response status should be 200')
        assert.equal(res.body.result, 'successfully updated')
        assert.equal(res.body._id, issue._id)
        done()
      })
  })
  test('Update an issue with missing _id: PUT request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .put('/api/issues/test')
      .send({
        _id: '',
        issue_title: 'updated title',
        issue_text: 'updated text',
      })
      .end((err, res) => {
        assert.equal(res.status, 200, 'response status should be 200')
        assert.equal(res.body.error, 'missing _id')
        done()
      })
  })
  test('Update an issue with no fields to update: PUT request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .put('/api/issues/test')
      .send({
        _id: issue._id,
      })
      .end((err, res) => {
        assert.equal(res.status, 200, 'response status should be 200')
        assert.equal(res.body.error, 'no update field(s) sent')
        assert.equal(res.body._id, issue._id)
        done()
      })
  })
  test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .put('/api/issues/test')
      .send({
        _id: '6384168db257532be5157fd6',
        issue_title: 'updated title',
        issue_text: 'updated text',
      })
      .end((err, res) => {
        assert.equal(res.status, 200, 'response status should be 200')
        assert.equal(res.body.error, 'could not update')
        assert.equal(res.body._id, '6384168db257532be5157fd6')
        done()
      })
  })
  test('Delete an issue: DELETE request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .delete('/api/issues/test')
      .send({
        _id: issue._id,
      })
      .end((err, res) => {
        assert.equal(res.status, 200, 'response status should be 200')
        assert.equal(res.body.result, 'successfully deleted')
        assert.equal(res.body._id, issue._id)
        done()
      })
  })
  test('Delete an issue: DELETE request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .delete('/api/issues/test')
      .send({
        _id: '6384168db257532be5157fd6',
      })
      .end((err, res) => {
        assert.equal(res.status, 200, 'response status should be 200')
        assert.equal(res.body.error, 'could not delete')
        assert.equal(res.body._id, '6384168db257532be5157fd6')
        done()
      })
  })
  test('Delete an issue: DELETE request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .delete('/api/issues/test')
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200, 'response status should be 200')
        assert.equal(res.body.error, 'missing _id')
        done()
      })
  })
})
