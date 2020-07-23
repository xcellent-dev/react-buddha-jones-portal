import React, { PropTypes } from 'react';
import { isEqual } from 'lodash';
import * as API from './../../actions/api';
import DropdownContainer from './../../components/Form/DropdownContainer';
import OptionsList from './../../components/Form/OptionsList';

const propTypes = {
    onChange: PropTypes.func,
    onNewCreated: PropTypes.func,
    onNewCreating: PropTypes.func,
    align: PropTypes.oneOf(['left', 'center', 'right']),
    label: PropTypes.string,
    valueLabel: PropTypes.string,
    truncuateLabelTo: PropTypes.number,
    excludeIds: PropTypes.arrayOf(PropTypes.number),
    projectId: PropTypes.number,
    disabledCreating: PropTypes.bool,
    closeWhenPicked: PropTypes.bool
};

const defaultProps = {
    onChange: null,
    onNewCreated: null,
    onNewCreating: null,
    align: 'right',
    excludeIds: [],
    label: 'Pick campaign',
    truncuateLabelTo: 32,
    disabledCreating: false,
    closeWhenPicked: true
};

/**
 * GenericStaffPicker
 */
class GenericStaffPicker extends React.Component {

    /**
    * GenericStaffPicker Constructor
    * @param {props} props from parent component
    * @return {void}
    */
    constructor(props) {
        super(props);

        this.state = {
            selected: {
                value: '',
                label: ''
            },
            staff: [],
            options: [],
            query: '',
            loadingOptions: false,            
            directHint: null
        };
    }

    /**
    * React lifecycle function -
    * - invoked immediately after a component is mounted
    * @return {void}
    */
    componentDidMount() {
        this.fetchStaff({
            length: 9999,
            offset: 0
        });
    }

    /**
    * React lifecycle function -
    * - invoked before a mounted component receives new props
    * set options of GenericStaffPicker after receiving new props
    * @return {void}
    */
    componentWillReceiveProps(nextProps) {
        if (this.state.staff.length > 0 && isEqual(this.props.excludeIds, nextProps.excludeIds) === false) {
            this.filterStaffToOptions(()=>{}, nextProps.excludeIds);
        }
    }

    /**
    * Close picker dropdown
    * @return {void}
    */
    closeDropdown() {
        if (typeof this.refs !== 'undefined' && typeof this.refs.genericStaffPickerDropdown !== 'undefined') {
            const dropdown = this.refs.genericStaffPickerDropdown;
            if (typeof dropdown.closeDropdown !== 'undefined') {
                dropdown.closeDropdown();
            }
        }
    }

    /**
    * Fetch staff data
    * @param {json} fetch options
    * @return {void}
    */
    fetchStaff(params) {
        this.setState({
            loadingOptions: true
        });
        API.get(API.STAFF, params)
            .then(response => {
                this.setState({
                    loadingOptions: false,
                    staff: response
                }, () => {
                    this.filterStaffToOptions(this.setSelectedStaffItem(this.props.selectedId));
                });
            }).catch(error => {
                this.setState({
                    loadingOptions: false
                });
            });
    }

    /**
    * Displays the selected option
    * @param {int} selectedId The ID of the selected option
    * @return {void}
    */
    setSelectedStaffItem(selectedId) {
        if (selectedId !== null) {
            let selectedLabel = null;
            this.state.staff.map((item, index)=>{
                if (item.id === selectedId) {
                    selectedLabel = item.name;
                }
            });
            if (selectedLabel !== null) {
                this.handleSelectOrCreate({
                    value: selectedId,
                    label: selectedLabel
                });
            }
        }
    }

    /**
    * Set options of GenericStaffPicker
    * @return {void}
    */
    filterStaffToOptions(cb, excludeIds) {
        excludeIds = typeof excludeIds !== 'undefined' ? excludeIds : this.props.excludeIds;

        const filteredStaff = excludeIds.length > 0
            ? this.state.staff.filter(c => excludeIds.indexOf(c.id) === -1)
            : this.state.staff;

        this.setState({
            options: filteredStaff.length > 0
                ? filteredStaff.map(c => {
                    return {
                        value: c.id,
                        label: c.name
                    };
                })
                : []
        }, ()=>{cb()});
    }
    

    /**
    * Handle select or create staff value
    * @param {json} a expnese data
    * @return {void}
    */
    handleSelectOrCreate(e) {
            let selectedRate = null;
            this.state.staff.map((item, index)=>{
                if (item.id === e.value) {
                    selectedRate = item.rate;
                }
            });
        
            // Select the campaign
            this.setState({
                selected: e
            });

            if (this.props.onChange) {
                e.rate = selectedRate;
                this.props.onChange(e);
            }

            if (this.props.closeWhenPicked) {
                this.closeDropdown();
            }
        
    }

    /**
    * Search staff
    * @param {str} Input value
    * @return {void}
    */
    handleSearchQuery(e) {
        this.setState({
            query: e.replace(/\b\w/g, l => l.toUpperCase())  // Capitalize
        }, () => {
            if (this.state.query === '' || this.isExactlyMatch(this.state.query)) {
                // Remove direct hint
                this.setState({
                    directHint: null
                });
            } else if (this.props.disabledCreating === false) {
                // Set direct hint
                this.setState({
                    directHint: {
                        value: '',
                        label: '' + this.state.query
                    }
                });
            }
        });
    }

    /**
    * Compare input value
    * @param {str} Input value
    * @return {void}
    */
    isExactlyMatch(query) {
        return !!this.state.options.find(option => option.label.toLowerCase() === query.trim().toLowerCase());
    }

    /**
    * Render GenericStaffPicker component
    * @return {jsxresult} result in jsx format
    */
    render() {
        
        return (
            <div className="campaignPicker">
                <DropdownContainer
                    ref="genericStaffPickerDropdown"
                    align={this.props.align}
                    minWidth={210}
                    overflowAuto={true}
                    label={this.props.label}
                    value={this.state.selected.label}
                >
                    <OptionsList
                        onChange={e => this.handleSelectOrCreate(e)}
                        search={{
                            autoFocus: true,
                            label: 'Search staff by name...',
                            onChange: (e) => this.handleSearchQuery(e),
                            value: this.state.query
                        }}
                        value={this.state.selected.value}
                        options={this.state.options}
                        loadingOptions={this.state.loadingOptions}
                        directHint={this.state.directHint}
                    />
                </DropdownContainer>
            </div>
        );
        
    }
}

GenericStaffPicker.propTypes = propTypes;
GenericStaffPicker.defaultProps = defaultProps;

export default GenericStaffPicker;
