'use strict'

const Issue = require('../models/Issue')

module.exports = function (app) {
  app
    .route('/api/issues/:project')
    .get(async function (req, res) {
      // get project's name from params
      const project_name = req.params.project

      // get issues using project name and query informations
      const issues = await Issue.find({ project_name, ...req.query })

      // return issues
      return res.json(issues)
    })
    .post(async function (req, res) {
      // get project's name from params
      const project_name = req.params.project

      // get issue info from request's body
      const { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body

      // title, text and author are musts
      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' })
      }

      // create the issue
      const issue = await Issue.create({
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        project_name,
      })

      // return the brand new issue
      return res.json(issue)
    })
    .put(async function (req, res) {
      // get id from request's body
      const {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open,
      } = req.body

      // if id is not provided it is not possible to identify which issue is going to be updated
      if (!_id) {
        return res.json({ error: 'missing _id' })
      }

      // check whether there is a non-empty input
      if (
        !issue_title &&
        !issue_text &&
        !created_by &&
        !assigned_to &&
        !status_text &&
        !open
      ) {
        return res.json({ error: 'no update field(s) sent', _id })
      }

      // if there are values that are changed, store them into update object
      let update = {}

      if (issue_title) update.issue_title = issue_title
      if (issue_text) update.issue_text = issue_text
      if (created_by) update.created_by = created_by
      if (assigned_to) update.assigned_to = assigned_to
      if (status_text) update.status_text = status_text
      update.open = open

      // assign the current time as the updated time
      update.updated_on = new Date()

      // make necessary updates
      const updatedIssue = await Issue.findByIdAndUpdate(_id, update)

      // on failure return error message
      if (!updatedIssue) {
        return res.json({ error: 'could not update', _id })
      }

      // on success return success message
      return res.json({ result: 'successfully updated', _id })
    })
    .delete(async function (req, res) {
      // get the id of the issue that is wanted to be deleted
      let { _id } = req.body

      // if there is no id return error message
      if (!_id) {
        return res.json({ error: 'missing _id' })
      }

      // find the issue and delete it
      const deletedIssue = await Issue.findByIdAndDelete(_id)

      // if there is failure return error message
      if (!deletedIssue) {
        return res.json({ error: 'could not delete', _id })
      }

      // return the success message
      return res.json({ result: 'successfully deleted', _id })
    })
}
