import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { NAMES } from '../../consts';
import { fetchRecordSummary } from '../../actions';

class MainPageDesktopDumb extends React.Component {
  constructor(props) {
    super(props);

    this.tryFetch = () => {
      if (this.props.user && this.props.user.phone) {
        props.fetchRecordSummary({
          start_date: '2018-05-01',
          end_date: '2018-05-31',
          employee_phone: this.props.user.phone,
        }, (data) => {
          this.dataKeySets = [];
          let currentList = [],
            counter = 0;
          for (let i = 5; i < data.recordsummary.order.length; i += 2) {
            currentList.push(data.recordsummary.order[i]);
            counter += 1;
            if (counter % 2 === 0) {
              this.dataKeySets.push(currentList);
              currentList = [];
            }
          }
        });
      } else {
        setTimeout(() => this.tryFetch(), 100);
      }
    };
    this.tryFetch();
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(res) {
    if (!res.destination || (res.destination.index === res.source.index &&
      res.destination.droppableId === res.source.droppableId)) {
      return;
    }
    if (res.destination.droppableId === res.source.droppableId) {
      const dataKeys = this.dataKeySets[parseInt(res.source.droppableId, 10)],
        [removed] = dataKeys.splice(res.source.index, 1);
      dataKeys.splice(res.destination.index, 0, removed);
    } else {
      const dataKeysFrom = this.dataKeySets[parseInt(res.source.droppableId, 10)],
        dataKeysTo = this.dataKeySets[parseInt(res.destination.droppableId, 10)];
      let [removed] = dataKeysFrom.splice(res.source.index, 1);
      dataKeysTo.splice(res.destination.index, 0, removed);
      [removed] = dataKeysTo.splice(-1, 1);
      dataKeysFrom.push(removed);
      this.forceUpdate();
    }
  }

  render() {
    const { user, recordsummary } = this.props;
    if (recordsummary && recordsummary.data && recordsummary.data[0]) {
      return (
        <div className="container-fluid mt-4">
          <div className="ml-3 mr-2 mb-3">
            <div className="text-dark">
              {NAMES.HELLO},&nbsp;
              {user.user && user.user.last_name}
              {user.user && user.user.first_name}
            </div>
          </div>
          <DragDropContext onDragEnd={this.onDragEnd}>
            {this.dataKeySets.map((dataKeys, setIndex) => (
              <Droppable droppableId={String(setIndex)} direction="horizontal" key={String(setIndex)} >
                {provided => (
                  <div className="d-inline-flex fill-container" ref={provided.innerRef}>
                    {dataKeys.map((dataKey, index) => (
                      <Draggable key={dataKey} draggableId={dataKey} index={index}>
                        {p => (
                          <div
                            ref={p.innerRef}
                            {...p.draggableProps}
                            {...p.dragHandleProps}
                            className="fill-container bg-dark p-3 ml-3 mr-3 mb-4"
                          >
                            <div className="text-white ml-4 mb-3">{dataKey}</div>
                            <ResponsiveContainer width="100%" height={400}>
                              <AreaChart data={recordsummary.data}>
                                <XAxis dataKey="日期" stroke="#bbb" />
                                <YAxis stroke="#bbb" />
                                <Tooltip />
                                <CartesianGrid stroke="#666" strokeDasharray="3 3" />
                                <Area
                                  type="monotone"
                                  fill="#348fe2"
                                  stroke="#348fe2"
                                  dataKey={dataKey}
                                  connectNulls
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                )}
              </Droppable>
            ))}
          </DragDropContext>
        </div>
      );
    }
    return null;
  }
}

MainPageDesktopDumb.propTypes = {
  user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  recordsummary: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchRecordSummary: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    user: state.data.user,
    recordsummary: state.data.recordsummary,
  }),
  mapDispatchToProps = dispatch => ({
    fetchRecordSummary: (body, callback) => dispatch(fetchRecordSummary(body, callback)),
  }),
  MainPageDesktop = connect(mapStateToProps, mapDispatchToProps)(MainPageDesktopDumb);

export default MainPageDesktop;
