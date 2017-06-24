import React, { Component } from 'react';
import { connect } from 'react-redux';
import USStates from '../../components/OptionsUSStates.jsx';
import Option from '../../components/Option.jsx';
import FileDropzone from '../../components/FileDropzone.jsx';
import StudentSelect from '../cpc/StudentSelect.jsx';
import * as cpcActions from '../../actions/creators/cpcContainerActions';


const mapStateToProps = store => ({
  newStudent:       store.cpcState.newStudent,
  campuses:         store.cpcState.campuses,
  campusesById:     store.cpcState.campusesById,
  programs:         store.cpcState.programs,
  programsById:     store.cpcState.programsById,
  currentProgram:   store.cpcState.currentProgram,
  simpleCampusesList: store.cpcState.simpleCampusesList,
  simpleCampusesById: store.cpcState.simpleCampusesById,
  simpleProgramsList: store.cpcState.simpleProgramsList,
  simpleProgramsById: store.cpcState.simpleProgramsById,
  simpleCohortList:   store.cpcState.simpleCohortList,
  simpleCohortsById:  store.cpcState.simpleCohortsById,
});

const mapDispatchToProps = (dispatch, ownProps) => ({

  init: (operation) => {
    let mode = '';
    if (operation === 'add') {
      dispatch(cpcActions.updateNewStudent('state', 'CA'));
      dispatch(cpcActions.updateNewStudent('cohort_id', 1));
    }

    dispatch(cpcActions.fetchCampusListThunk('dropdown', operation));
  },

  handleCampusChange: (operation, event) => {
    console.log(`StudentForm handleCampusChange - campusId: ${event.target.value} op:${operation}`);
    dispatch(cpcActions.fetchProgramListThunk(event.target.value, 'dropdown', operation));
  },

  handleProgramChange: (operation, event) => {
    console.log(`StudentForm handleProgramChange - programId: ${event.target.value}`);
    dispatch(cpcActions.fetchCohortListThunk(event.target.value, 'dropdown', operation));
  },

  handleChange: (operation, event) => {
    console.log(`StudentForm in handleChange ${event.target.name} = ${event.target.value}`);
    if (operation === 'edit')
      dispatch(cpcActions.updateCurrentStudent(event.target.name, event.target.value));
    else
      dispatch(cpcActions.updateNewStudent(event.target.name, event.target.value));
  },

  handleSubmit: (student, operation, event) => {
    event.preventDefault();
    console.log('StudentForm Submit', operation, student.first_name, student.last_name);
    if (operation === 'edit')
      dispatch(cpcActions.postCurrentStudentThunk(student));
    else
      dispatch(cpcActions.postNewStudentThunk(student));
  },

});

class StudentForm extends Component {
  constructor(props) {
    super(props);
  }

  componentWillUpdate() {
    console.log('StudentForm in CWU');

    // There has to be a more elegant way to clear the form...
    let studentForm = document.getElementById('studentForm');
    const allFields = studentForm.querySelectorAll('input');
    for (let node in allFields) {
      if (allFields.hasOwnProperty(node) && typeof allFields[node] === 'object')
        allFields[node].value = '';
    }
  }

  componentWillMount() {
    console.log('StudentForm in CWM currentProgram:', this.props.currentProgram);
    this.props.init(this.props.operation);
  }

  render() {
    const student = this.props.student;

    console.log('StudentForm in render', student);

    let campusOptions = [];
    if (this.props.simpleCampusesList && this.props.simpleCampusesList.length) {
      campusOptions = this.props.simpleCampusesList.map((campusId, i) => (
        <Option key={i} id={'campusOpt' + i} value={campusId}
                name={this.props.simpleCampusesById[campusId].name }/>
      ));
    }

    let programOptions = [];
    if (this.props.simpleProgramsList && this.props.simpleProgramsList.length) {
      programOptions = this.props.simpleProgramsList.map((programId, i) => (
        <Option key={i} id={'programOpt' + i} value={programId}
                name={this.props.simpleProgramsById[programId].program_name }/>
      ));
    }

    let cohortOptions = [];
    if (this.props.simpleCohortList && this.props.simpleCohortList.length) {
      cohortOptions = this.props.simpleCohortList.map((cohortId, i) => (
        <Option key={i} id={'cohortOpt' + i} value={cohortId}
                name={this.props.simpleCohortsById[cohortId].cohort_name }/>
      ));
    }

    let studentSelect;
    if (this.props.operation === 'edit') {
      studentSelect = <StudentSelect/>;
    }

    return (
      <form id="studentForm" className="form-horizontal">
        <fieldset>
          <legend>{this.props.legend}</legend>
          {studentSelect}
          <div className="form-group">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-addon">First Name</span>
                <input id="firstName" name="first_name" className="form-control"
                       placeholder="" type="text" value={student.first_name}
                       onChange={(event) => this.props.handleChange(this.props.operation, event)}/>
              </div>
            </div>
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-addon">Middle Name</span>
                <input id="middleName" name="middle_name" className="form-control"
                       placeholder="" type="text" value={student.middle_name}
                       onChange={(event) => this.props.handleChange(this.props.operation, event)}/>
              </div>
            </div>
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-addon">Last Name</span>
                <input id="lastName" name="last_name" className="form-control"
                       placeholder="" type="text" value={student.last_name}
                       onChange={(event) => this.props.handleChange(this.props.operation, event)}/>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-1 control-label" htmlFor="dropdownCampusSelect">Campus</label>
            <div className="col-md-3">
              <select id="dropdownCampusSelect" className="form-control"
                      onChange={(event) => this.props.handleCampusChange(this.props.operation, event)}
                      value={student.campus_id}>
                {campusOptions}
              </select>
            </div>
            <label className="col-md-1 control-label"
                   htmlFor="dropdownProgramSelect">Program</label>
            <div className="col-md-3">
              <select id="dropdownProgramSelect" className="form-control"
                      onChange={(event) => this.props.handleProgramChange(this.props.operation, event)}
                      value={student.program_id}>
                {programOptions}
              </select>
            </div>
            <label className="col-md-1 control-label"
                   htmlFor="dropdownCohortSelect">Cohort</label>
            <div className="col-md-3">
              <select id="dropdownCohortSelect" name="cohort_id"
                      className="form-control"
                      onChange={(event) => this.props.handleChange(this.props.operation, event)}
                      value={student.cohort_id}>
                {cohortOptions}
              </select>
            </div>
          </div>
          <div className="form-group">
            <div className="col-md-12">
              <div className="input-group">
                <span className="input-group-addon">Address 1</span>
                <input id="address1" name="street_address_1" className="form-control"
                       placeholder="123 Tech Ave" type="text" value={student.street_address_1}
                       onChange={(event) => this.props.handleChange(this.props.operation, event)}/>
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="col-md-12">
              <div className="input-group">
                <span className="input-group-addon">Address 2</span>
                <input id="address2" name="street_address_2" className="form-control"
                       placeholder="Suite 1A" type="text" value={student.street_address_2}
                       onChange={(event) => this.props.handleChange(this.props.operation, event)}/>
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-addon">City</span>
                <input id="city" name="city" className="form-control"
                       placeholder="Los Angeles" type="text" value={student.city}
                       onChange={(event) => this.props.handleChange(this.props.operation, event)}/>
              </div>
            </div>
            <div className="col-md-2">
              <USStates name="state" selectedState={student.state}
                        handleChange={(event) => this.props.handleChange(this.props.operation, event)}/>
            </div>
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-addon">Zip Code</span>
                <input id="zipCode" name="zip_code" className="form-control"
                       placeholder="90066" type="text" value={student.zip_code}
                       onChange={(event) => this.props.handleChange(this.props.operation, event)}/>
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-addon">Primary Phone</span>
                <input id="primaryPhone" name="primary_phone" className="form-control"
                       placeholder="" type="tel" value={student.primary_phone}
                       onChange={(event) => this.props.handleChange(this.props.operation, event)}/>
              </div>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-addon">Secondary Phone</span>
                <input id="secondaryPhone" name="secondary_phone" className="form-control"
                       placeholder="" type="tel" value={student.secondary_phone}
                       onChange={(event) => this.props.handleChange(this.props.operation, event)}/>
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-addon">Emergency Contact</span>
                <input id="emergencyContact" name="emergency_contact" className="form-control"
                       placeholder="" type="text" value={student.emergency_contact}
                       onChange={(event) => this.props.handleChange(this.props.operation, event)}/>
              </div>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-addon">Emergency Phone</span>
                <input id="emergencyPhone" name="emergency_contact_phone" className="form-control"
                       placeholder="" type="tel" value={student.emergency_contact_phone}
                       onChange={(event) => this.props.handleChange(this.props.operation, event)}/>
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-addon">Email</span>
                <input id="email" name="email" className="form-control"
                       placeholder="" type="email" value={student.email}
                       onChange={(event) => this.props.handleChange(this.props.operation, event)}/>
              </div>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-addon">Github Name</span>
                <input id="githubName" name="github_name" className="form-control"
                       placeholder="" type="text" value={student.github_name}
                       onChange={(event) => this.props.handleChange(this.props.operation, event)}/>
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="col-md-6">
              <div className="input-group">
                <FileDropzone id="bioImg" name="bio_img" overlay="picUploadOverlay bioPicUploadOverlay"
                              image={student.bio_img ?
                                  'client/assets/images/' + student.cohort_id + '/' + student.bio_img : null }
                              label="Bio Image" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <FileDropzone id="codesmithImg" name="codesmith_img" overlay="picUploadOverlay csPicUploadOverlay"
                              image={student.codesmith_img ?
                                  'client/assets/images/' + student.cohort_id + '/' + student.codesmith_img : null }
                              label="Codesmith Image" />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="col-md-6">
              <button className="btn btn-primary"
                      onClick={(event) => this.props.handleSubmit(student, this.props.operation, event)}>
                Submit
              </button>
            </div>
          </div>
        </fieldset>
      </form>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentForm);