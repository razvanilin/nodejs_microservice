import React, { Component } from 'react';

import {
  Grid, Segment, Header, List, Button, Icon, Form, Input, Divider, Dimmer, Loader,
  Dropdown, Modal, Message
} from 'semantic-ui-react';

import {
  createCompany, updateCompany, getCompanies, createWorkspace, updateWorkspace,
  addUserToWorkspace, removeUserFromWorkspace,
} from './actions/company';
import {
  getUsers, createUser,
} from './actions/user';

class App extends Component {
  state = {
    loading: true,
    loadingUsers: true,
    companies: [],
    company: {},
    // workspace: {},
    users: [],
    newCompany: {},
    newWorkspace: {},
    updateCompany: {},
    updateWorkspace: {},
    newUser: {role: "basic"},
  }

  userRoles = [
    {text: "basic", value: "basic"},
    {text: "admin", value: "admin"},
  ]

  componentWillMount() {
    getCompanies()
    .then(companies => {
      this.setState({companies, loading: false});
    })
    .catch(error => {
      this.setState({error, loading: false});
    });

    getUsers()
    .then(users => {
      this.setState({users, loadingUsers: false});
    })
    .catch(error => {
      this.setState({error, loadingUsers: false});
    });
  }

  _addCompany = () => {
    // validation
    if (!this.state.newCompany.displayName) {
      this.setState({newCompanyError: true});
      return;
    }

    // make the request to the API and add the new company to the state if successful
    this.setState({creatingCompany: true, error: false});
    createCompany(this.state.newCompany)
    .then(company => {
      this.setState({creatingCompany: false, companies: [...this.state.companies, company]});
    })
    .catch(error => {
      this.setState({error: "Error with company creation", creatingCompany: false});
    });
  }

  _updateCompany = () => {
    // validation
    if (!this.state.updateCompany.displayName) {
      this.setState({newCompanyError: true});
      return;
    }

    this.setState({updatingCompany: true, error: false});
    updateCompany(this.state.company._id, this.state.updateCompany)
    .then(updatedCompany => {
      // replace the company without mutating the state
      let companies = [...this.state.companies];
      for (var i in companies) {
        if (companies[i]._id === updatedCompany._id) {
          companies[i] = updatedCompany;
          this.setState({company: updatedCompany})
          break;
        }
      };

      // update the state
      this.setState({updatingCompany: false, companies, companyModal: false});
    })
    .catch(error => {
      this.setState({error: "Error with company creation", creatingCompany: false, companyModal: false});
    });
  }

  _loadCompany(id) {
    // select the company from the state
    let company = this.state.companies.find(el => {
      if (el._id === id) return el;
      return false;
    });

    this.setState({company});
  }

  _addWorkspace = () => {
    // validation
    if (!this.state.newWorkspace.displayName) {
      this.setState({newWorkspaceError: true});
      return;
    }

    // make the request to the API and add the new company to the state if successful
    this.setState({creatingWorkspace: true, error: false});
    createWorkspace(this.state.company._id, this.state.newWorkspace)
    .then(company => {
      let companies = [...this.state.companies];
      for (var i in companies) {
        if (companies[i]._id === company._id) {
          companies[i] = company;
          break;
        }
      }

      this.setState({creatingWorkspace: false, companies, company});
    })
    .catch(error => {
      this.setState({error: "Error with workspace creation", creatingWorkspace: false});
    });
  }

  _updateWorkspace = () => {
    // validation
    if (!this.state.updateWorkspace.displayName) {
      this.setState({updateWorkspaceError: true});
      return;
    }

    // make the request to the API and add the new company to the state if successful
    this.setState({updatingWorkspace: true, error: false});
    updateWorkspace(this.state.company._id, this.state.workspace._id, this.state.updateWorkspace)
    .then(company => {
      let companies = [...this.state.companies];
      for (var i in companies) {
        if (companies[i]._id === company._id) {
          companies[i] = company;
          break;
        }
      }

      this.setState({updatingWorkspace: false, companies, company, workspace: null, workspaceModal: false});
    })
    .catch(error => {
      this.setState({error: "Error with workspace update", updatingWorkspace: false, workspaceModal: false});
    });
  }

  _addUser = () => {
    // validation
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!this.state.newUser.email || !this.state.newUser.email.match(mailformat)) {
      this.setState({newUserError: true});
      return;
    }

    // make the request to the API and add the new company to the state if successful
    this.setState({creatingUser: true, error: false});
    createUser(this.state.newUser)
    .then(user => {
      this.setState({creatingUser: false, users: [...this.state.users, user]});
    })
    .catch(error => {
      this.setState({error: "Error with user creation", creatingUser: false});
    });
  }

  _getUser = (id) => {
    let user = this.state.users.find(el => {
      if (el._id === id) return el;
      return false;
    });
    return user;
  }

  _userToWorkspace = (idu) => {
    if (!this.state.workspace) return;
    // try to find the user in the selected workspace
    let index = this.state.workspace.users.indexOf(idu);

    // if found, remove the user from the workspace
    if (index > -1) {
      removeUserFromWorkspace(this.state.company._id, this.state.workspace._id, idu)
      .then(company => {
        let companies = [...this.state.companies];
        for (var i in companies) {
          if (companies[i]._id === company._id) {
            companies[i] = company;
            break;
          }
        }

        let workspace;
        for (var j in company.workspaces) {
          if (company.workspaces[j]._id === this.state.workspace._id) {
            workspace = company.workspaces[j];
          }
        }

        this.setState({companies, company, workspace});
      })
      .catch(error => {
        this.setState({error: "Error with workspace creation"});
      });
    } else {
      // add the user to the workspace
      addUserToWorkspace(this.state.company._id, this.state.workspace._id, idu)
      .then(company => {
        let companies = [...this.state.companies];
        for (var i in companies) {
          if (companies[i]._id === company._id) {
            companies[i] = company;
            break;
          }
        }

        let workspace;
        for (var j in company.workspaces) {
          if (company.workspaces[j]._id === this.state.workspace._id) {
            workspace = company.workspaces[j];
          }
        }

        this.setState({companies, company, workspace});
      })
      .catch(error => {
        this.setState({error: "Error with workspace creation"});
      });
    }
  }

  _renderCompanies = () => {
    return (
      <Segment>
        <Header>Companies</Header>
        <Divider/>

        <Dimmer active={this.state.loading} inverted>
          <Loader inverted>Loading companies...</Loader>
        </Dimmer>

        <Form>
          <Form.Field error={!!this.state.newCompanyError}>
            <Input value={this.state.newCompany.displayName || ""} placeholder="Enter company name"
              onChange={(e,data) => this.setState({newCompany: {displayName: data.value}})}
            />
          </Form.Field>
          <Form.Field>
            <Button primary size="small" icon="add" labelPosition="right" content="Add company"
              onClick={this._addCompany} loading={this.state.creatingCompany}
            />
          </Form.Field>
        </Form>
        <Divider />
        <List selection verticalAlign="middle" size="large">
          {this.state.companies.map(company => {
            return (
              <List.Item key={company._id} onClick={() => this._loadCompany(company._id)}>
                <List.Content>
                  <List.Header>{company.displayName}</List.Header>
                  <small>{company.name}</small>
                </List.Content>
              </List.Item>
            )
          })}
        </List>
      </Segment>
    )
  }

  _renderSingleCompany = () => {
    return (
      <Segment>
        <Header>
          {this.state.company.displayName || "Select a company from the list"}
          <Header.Subheader>
            {this.state.company.name}
          </Header.Subheader>
        </Header>

        {this.state.company.name &&
          <div>
            <Divider />

            <Button icon="edit" size="small" labelPosition="right" content="Edit company"
              onClick={() => this.setState({companyModal: true})}
            />


            <Header as="h4">Workspaces</Header>
            <Divider />

            <Form>
              <Form.Field error={!!this.state.newWorkspaceError}>
                <Input placeholder="Enter workspace name" value={this.state.newWorkspace.displayName || ""}
                  onChange={(e,data) => this.setState({newWorkspace: {displayName: data.value}})}
                />
              </Form.Field>
              <Form.Field>
                <Button primary icon="add" size="small" labelPosition="right" content="Add workspace"
                  onClick={this._addWorkspace}
                />
              </Form.Field>
            </Form>
            <List verticalAlign="middle" size="large">
              {this.state.company.workspaces.map(workspace => {
                return (
                  <List.Item key={workspace._id}>
                    <List.Content floated="right">
                      <Button.Group>
                        {!this.state.workspace && <Button positive icon="add user" onClick={() => this.setState({workspace})}/>}
                        {this.state.workspace && <Button color="yellow" icon="delete" onClick={() => this.setState({workspace: null})}/>}
                        <Button icon="edit" onClick={() => this.setState({workspaceModal: true, workspace})}/>
                      </Button.Group>
                    </List.Content>
                    <List.Content>
                      <List.Header>{workspace.displayName}</List.Header>
                      <small>{workspace.name}</small>
                    </List.Content>
                    <List.List size="small">
                      {workspace.users.map(user => {
                        return (
                          <List.Item key={user}>
                            <List.Content>{this._getUser(user).email}</List.Content>
                          </List.Item>
                        )
                      })}
                    </List.List>
                  </List.Item>
                )
              })}
            </List>
          </div>
        }
      </Segment>
    )
  }

  _renderUsers = () => {
    return (
      <Segment>
        <Header>Users</Header>
        <Divider />

        <Dimmer active={this.state.loadingUsers} inverted>
          <Loader inverted>Loading companies...</Loader>
        </Dimmer>

        <Form>
          <Form.Field error={!!this.state.newUserError}>
            <Input value={this.state.newUser.email || ""} placeholder="Enter email"
              onChange={(e,data) => this.setState({newUser: {...this.state.newUser, email: data.value}})}
            />
          </Form.Field>
          <Form.Field>
            <Dropdown defaultValue="basic" fluid selection options={this.userRoles}
              onChange={(e,data) => this.setState({newUser: {...this.state.newUser, role: data.value}})}
            />
          </Form.Field>
          <Form.Field>
            <Button primary size="small" icon="add" labelPosition="right" content="Add user"
              onClick={this._addUser} loading={this.state.creatingUser}
            />
          </Form.Field>
        </Form>
        <Divider />

        {this.state.workspace && <Header>Select users to add/remove from workspace</Header>}
        <List selection={!!this.state.workspace} verticalAlign="middle" size="large">
          {this.state.users.map(user => {
            return (
              <List.Item key={user._id}
                onClick={() => this._userToWorkspace(user._id)}
                active={this.state.workspace && this.state.workspace.users.indexOf(user._id) > -1}
              >
                <List.Content>
                  <List.Header>{user.email}</List.Header>
                  <small>{user.role}</small>
                </List.Content>
              </List.Item>
            )
          })}
        </List>
      </Segment>
    )
  }

  render() {
    return (
      <div className="App">
        {this.state.error &&
          <Message negative onDismiss={()=>this.setState({error: null})}>
            <Message.Header>Oups, something went wrong</Message.Header>
            <p>{this.state.error}</p>
          </Message>
        }
        <Grid columns={3} centered style={{paddingTop: 20}} stackable>
          <Grid.Column width={5}>
            {this._renderCompanies()}
          </Grid.Column>
          <Grid.Column width={5}>
            {this._renderSingleCompany()}
          </Grid.Column>
          <Grid.Column width={5}>
            {this._renderUsers()}
          </Grid.Column>
        </Grid>

        <Modal open={this.state.companyModal} onClose={()=>this.setState({companyModal: false})}>
          <Modal.Header>Update company - {this.state.company.displayName}</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Field error={!!this.state.updateCompanyError}>
                <label>New company name</label>
                <Input placeholder="Enter a new name" value={this.state.updateCompany.displayName || ""}
                  onChange={(e, data) => this.setState({updateCompany: {displayName: data.value}})}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button content="Cancel" onClick={()=>this.setState({companyModal: false})}/>
            <Button primary icon="checkmark" labelPosition="right" content="Save"
              onClick={this._updateCompany}
            />
          </Modal.Actions>
        </Modal>

        <Modal open={this.state.workspaceModal} onClose={()=>this.setState({workspaceModal: false, workspace: null})}>
          <Modal.Header>Update workspace</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Field error={!!this.state.updateWorkspaceError}>
                <label>New workspace name</label>
                <Input placeholder="Enter a new name" value={this.state.updateWorkspace.displayName || ""}
                  onChange={(e, data) => this.setState({updateWorkspace: {displayName: data.value}})}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button content="Cancel" onClick={()=>this.setState({workspaceModal: false, workspace: null})}/>
            <Button primary icon="checkmark" labelPosition="right" content="Save"
              onClick={this._updateWorkspace}
            />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default App;
