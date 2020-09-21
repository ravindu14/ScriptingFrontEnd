// @flow
import React, { PureComponent } from "react";
import { Link, location, withRouter } from "react-router-dom";

import Icon from "components/icon";

import "./styles.scss";

type SidebarProps = {
  location: location,
};

type SidebarState = {
  activeMainCategory: string,
  showContent: boolean,
};

class Sidebar extends PureComponent<SidebarProps, SidebarState> {
  CATEGORIES = {
    DASHBOARD: "dashboard",
    PURCHASES: "purchases",
    INVENTORY: "inventory",
    SALES: "sales",
    CUSTOMERS: "customers",
    SUPPLIERS: "suppliers",
    SETTINGS: "settings",
  };

  constructor(props) {
    super(props);

    this.state = {
      activeMainCategory: this.CATEGORIES.DASHBOARD,
    };

    // $FlowFixMe
    this.onClickMainCategory = this.onClickMainCategory.bind(this);
    // $FlowFixMe
    this.showSideMenu = this.showSideMenu.bind(this);
    // $FlowFixMe
    this.hideSideMenu = this.hideSideMenu.bind(this);
    // $FlowFixMe
    this.changeLocation = this.changeLocation.bind(this);
  }

  componentDidMount() {
    const {
      location: { pathname },
    } = this.props;

    this.setState({
      ...this.state,
      activeMainCategory:
        pathname !== "/" && localStorage.getItem("active-sidebar-category")
          ? localStorage.getItem("active-sidebar-category")
          : this.CATEGORIES.DASHBOARD,
    });
  }

  changeLocation(activeMainCategory) {
    localStorage.setItem("active-sidebar-category", activeMainCategory);
  }

  onClickMainCategory(selectedCategory) {
    localStorage.setItem("active-sidebar-category", selectedCategory);

    this.setState({
      ...this.state,
      activeMainCategory: selectedCategory,
      showContent: true,
    });
  }

  showSideMenu() {
    this.setState({
      ...this.state,
      showContent: true,
    });
  }

  hideSideMenu() {
    this.setState({
      ...this.state,
      showContent: false,
    });
  }

  render() {
    let { activeMainCategory } = this.state;

    return (
      <div
        className={`main-side-bar-container ${activeMainCategory ===
          this.CATEGORIES.DASHBOARD && "main-side-bar-dashboard-container"}`}
      >
        <div className="sidebar">
          <div className="avatar">
            <Icon icon="profile" />
          </div>
          <Link to="/">
            <div
              className={`menu-item ${activeMainCategory ===
                this.CATEGORIES.DASHBOARD && "active"}`}
              onClick={() =>
                this.onClickMainCategory(this.CATEGORIES.DASHBOARD)
              }
            >
              <span>New Script</span>
            </div>
          </Link>
          <Link to="/scripts">
            <div
              className={`menu-item ${activeMainCategory ===
                this.CATEGORIES.PURCHASES && "active"}`}
              onClick={() =>
                this.onClickMainCategory(this.CATEGORIES.PURCHASES)
              }
            >
              <span>Script</span>
            </div>
          </Link>
          <Link to="/story-board">
            <div
              className={`menu-item ${activeMainCategory ===
                this.CATEGORIES.INVENTORY && "active"}`}
              onClick={() =>
                this.onClickMainCategory(this.CATEGORIES.INVENTORY)
              }
            >
              <span>Story Board</span>
            </div>
          </Link>
          <Link to="/inventory">
            <div
              className={`menu-item ${activeMainCategory ===
                this.CATEGORIES.SALES && "active"}`}
              onClick={() => this.onClickMainCategory(this.CATEGORIES.SALES)}
            >
              <span>Inventory</span>
            </div>
          </Link>
          <Link to="/actors">
            <div
              className={`menu-item ${activeMainCategory ===
                this.CATEGORIES.SUPPLIERS && "active"}`}
              onClick={() =>
                this.onClickMainCategory(this.CATEGORIES.SUPPLIERS)
              }
            >
              <span>Actors</span>
            </div>
          </Link>
          <Link to="/time-table">
            <div
              className={`menu-item ${activeMainCategory ===
                this.CATEGORIES.CUSTOMERS && "active"}`}
              onClick={() =>
                this.onClickMainCategory(this.CATEGORIES.CUSTOMERS)
              }
            >
              <span>Time Table</span>
            </div>
          </Link>
        </div>
      </div>
    );
  }
}

export default withRouter(Sidebar);
