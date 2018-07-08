import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { NAMES, URLS } from '../../consts';

class FilterProfileViewMobile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="container mt-5 col-8 shadow mb-5 bg-white rounded pt-5 pb-5">
        <div className="ml-3 mr-3">
          {this.props.filterprofiles.map(filterprofile => (
            <div className="card" key={filterprofile.id}>
              <div
                className="card-header bg-dark text-light center-display"
                data-toggle="collapse"
                data-target={`#collapse${filterprofile.id}`}
                aria-expanded="true"
              >
                <div>
                  {filterprofile.name}
                </div>
                <Route
                  render={({ history }) => (
                    <button
                      className="btn btn-info ml-auto"
                      onClick={() => {
                        this.props.loadFilterProfile(filterprofile);
                        history.push(URLS.RECORD_VIEW);
                      }}
                    >
                      {NAMES.FILTER_PROFILE_LOAD}
                    </button>
                  )}
                />
              </div>
              <div id={`collapse${filterprofile.id}`} className="collapse">
                <div className="card-body">
                  <div>
                    {NAMES.FILTER_PROFILE_FILTER_OBJ}:&nbsp;
                    [{filterprofile.filterObj
                      && Object.keys(filterprofile.filterObj).map((key) => {
                        const { filterObj } = filterprofile;
                        if (filterObj[key].value.number) {
                          return `${key}: ${filterObj[key].value.comparator}${filterObj[key].value.number}`;
                        }
                        return `${key}: ${filterObj[key].value}`;
                      }).join(', ')}]
                  </div>
                  <div>
                    {NAMES.FILTER_PROFILE_SHOW_COMMENT}:&nbsp;
                    [{filterprofile.showComment
                      && Object.keys(filterprofile.showComment)
                        .filter(key => filterprofile.showComment[key]).join(', ')}]
                  </div>
                  <div>
                    {NAMES.FILTER_PROFILE_COLUMN_HIDDEN}:&nbsp;
                    [{filterprofile.columnHidden
                      && Object.keys(filterprofile.columnHidden)
                        .filter(key => filterprofile.columnHidden[key]).join(', ')}]
                  </div>
                  <div>
                    {NAMES.FILTER_PROFILE_SEARCH_TEXT}:&nbsp;
                    {filterprofile.searchText}
                  </div>
                  <div className="center-display">
                    <button
                      className="btn btn-danger"
                      onClick={() => this.props.deleteFilterProfile(this.props.userId, filterprofile.id)}
                    >
                      {NAMES.FILTER_PROFILE_DELETE}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

FilterProfileViewMobile.propTypes = {
  filterprofiles: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  loadFilterProfile: PropTypes.func.isRequired,
  deleteFilterProfile: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};

export default FilterProfileViewMobile;
