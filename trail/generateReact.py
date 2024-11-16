import json

def generate_react_component(config_file):
    with open(config_file) as f:
        config = json.load(f)

    dashboard_name = config['dashboard_name']
    column_names = config['column_names']

    filter_states = ', '.join([f'{col}: ["ALL"]' for col in column_names])
    filter_dropdowns = '\n'.join([
    f'''
      <li className="dropdown">
        <p className="dropdown-toggle">{col}</p>
        <div className="dropdown-content">
          <ul className="{col}-dropdown">
            {{'{{'}}filters.{col}.map(value => (
              <li key={{value}}>
                <button onClick={{() => handleFilterClick('{col}', value)}}>
                  {{'{{'}}value{{'}}'}}
                </button>
              </li>
            )){{'}}'}}
          </ul>
        </div>
      </li>
    ''' for col in column_names
])


    with open('DashboardTemplate.js') as template_file:
        template = template_file.read()

    component = template.replace('{DASHBOARD_NAME}', dashboard_name)
    component = component.replace('{FILTER_STATES}', filter_states)
    component = component.replace('{FILTER_DROPDOWNS}', filter_dropdowns)
    component = component.replace('{API_ENDPOINT}', f'{dashboard_name.lower()}_data')
    component = component.replace('{COLUMN_NAMES}', ', '.join(column_names))

    with open(f'{dashboard_name}.js', 'w') as output_file:
        output_file.write(component)

# Generate the React component based on the configuration
generate_react_component('salesdashboard_config.json')
