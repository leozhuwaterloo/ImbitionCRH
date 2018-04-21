/* eslint no-underscore-dangle: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import DistinctViewPage from '../DistinctViewPage';
import { NAMES } from '../../consts';
import { fetchData } from '../../actions';

function diagonal(d) {
  const path = `M${d.source.x} ${d.source.y}
        L${d.target.x}, ${d.target.y}`;
  return path;
}

class PositionTreeViewDumb extends React.Component {
  constructor(props) {
    super(props);
    this.treeDomId = 'tree';
    this.i = 0;
    this.desktopRender = () => <div id={this.treeDomId} />;
    this.createTree = this.createTree.bind(this);
    this.updateTree = this.updateTree.bind(this);
    this.margin = {
      top: 40, right: 40, bottom: 20, left: 40,
    };
    this.duration = 750;
    this.nodeclick = (d) => {
      if (this.clicked) return;
      this.clicked = true;
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      // so that it can only be clicked once every duration interval
      setTimeout(() => {
        this.clicked = false;
      }, this.duration + 50);
      this.updateTree(d);
    };

    this.tryCreate = () => {
      if (Object.keys(this.props.positiontree).length !== 0) {
        this.createTree(this.props.positiontree);
      } else {
        setTimeout(() => this.tryCreate(), 100);
      }
    };

    this.tryFetch = () => {
      if (this.props.positionId !== -1) {
        this.props.fetchPositionTree(this.props.positionId);
        setTimeout(() => this.tryCreate(), 200);
      } else {
        setTimeout(() => this.tryFetch(), 100);
      }
    };
  }

  componentDidMount() {
    this.width = window.innerWidth - 220 - this.margin.right - this.margin.left;
    this.height = window.innerHeight - this.margin.top - this.margin.bottom;
    this.tryFetch();
  }

  createTree(treeData) {
    // initialize all data and svg container
    this.treemap = d3.tree().size([this.width, this.height]);
    this.svg = d3.select(`#${this.treeDomId}`).append('svg')
      .attr('width', this.width + this.margin.right + this.margin.left)
      .attr('height', this.height + this.margin.top + this.margin.bottom);
    this.svg = this.svg.append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);


    this.root = d3.hierarchy(treeData, d => d.children);
    this.root.x0 = this.width / 2;
    this.root.y0 = 0;
    this.updateTree(this.root);
  }

  updateTree(source) {
    // get nodes and links based on root
    const treeRoot = this.treemap(this.root),
      nodes = treeRoot.descendants().reverse(),
      links = treeRoot.descendants().slice(1);
    let node = null,
      link = null,
      nodeEnter = null,
      nodeUpdate = null,
      nodeExit = null,
      linkEnter = null,
      linkUpdate = null;
    // Normalize for fixed-depth
    nodes.forEach((d) => {
      d.y = d.depth * 80;
    });

    // initialize all nodes
    node = this.svg.selectAll('g.node')
      .data(nodes, (d) => {
        if (d.id) return d.id;
        this.i += 1;
        d.id = this.i;
        return d.id;
      });

    nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr('transform', () => `translate(${source.x0}, ${source.y0})`)
      .on('click', this.nodeclick);
    nodeEnter.append('rect')
      .attr('x', -50)
      .attr('y', -15)
      .style('fill-opacity', 1e-6)
      .attr('class', d => (d._children ? 'collapsed' : ''));
    nodeEnter.append('text')
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .style('fill-opacity', 1e-6)
      .text(d => d.data.name);


    nodeUpdate = nodeEnter.merge(node);
    nodeUpdate.transition()
      .duration(this.duration)
      .attr('transform', d => `translate(${d.x},${d.y})`);
    nodeUpdate.select('rect')
      .attr('width', 100)
      .attr('height', 30)
      .style('fill-opacity', 1)
      .attr('class', d => (d._children ? 'collapsed' : ''));
    nodeUpdate.select('text')
      .style('fill-opacity', 1);

    nodeExit = node.exit().transition()
      .duration(this.duration)
      .attr('transform', () => `translate(${source.x},${source.y})`)
      .remove();
    nodeExit.select('rect')
      .style('fill-opacity', 1e-6);
    nodeExit.select('text')
      .style('fill-opacity', 1e-6);

    // initialize all links
    link = this.svg.selectAll('path.link')
      .data(links, d => d.id);

    linkEnter = link.enter().insert('path', 'g')
      .attr('class', 'link')
      .attr('d', () => {
        const o = { x: source.x0, y: source.y0 };
        return diagonal({ source: o, target: o });
      });

    linkUpdate = linkEnter.merge(link);
    linkUpdate.transition()
      .duration(this.duration)
      .attr('d', d => diagonal({ source: d, target: d.parent }));

    link.exit().transition()
      .duration(this.duration)
      .attr('d', () => {
        const o = { x: source.x, y: source.y };
        return diagonal({ source: o, target: o });
      })
      .remove();

    // Stash the old positions for transition
    nodes.forEach((d) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  render() {
    return (
      <DistinctViewPage
        title={NAMES.POSITION_TREE_VIEW}
        mobileRender={() => <div>{NAMES.NO_PHONE}</div>}
        desktopRender={() => this.desktopRender()}
      />
    );
  }
}


PositionTreeViewDumb.propTypes = {
  positiontree: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  positionId: PropTypes.number.isRequired,
  fetchPositionTree: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    positiontree: state.data.positiontree,
    positionId: (state.data.user && state.data.user.position && state.data.user.position.id) || -1,
  }),
  mapDispatchToProps = dispatch => ({
    fetchPositionTree: positionId => dispatch(fetchData(`positiontree/${positionId}`)),
  }),
  PositionTreeView = connect(mapStateToProps, mapDispatchToProps)(PositionTreeViewDumb);

export default PositionTreeView;
