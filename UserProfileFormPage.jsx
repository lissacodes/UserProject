import React from "react";
import PageTitle from "../../layout-components/PageTitle";
import UserProfileForm from "./UserProfileForm";

class UserProfileFormPage extends React.Component {
  render() {
    return (
      <>
        <PageTitle titleHeading="Profile Form"></PageTitle>
        <UserProfileForm {...this.props} />
      </>
    );
  }
}

export default UserProfileFormPage;
