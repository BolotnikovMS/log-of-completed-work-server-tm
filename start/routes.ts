import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'HomeController.index')
    .middleware('auth:api')
  Route.post('/login', 'AuthController.login')
  Route.get('/logout', 'AuthController.logout')
    .middleware('auth:api')
  Route.group(() => {
    Route.get('/', 'UsersController.index')
    Route.get('/:id', 'UsersController.show')
    Route.post('/create-account', 'UsersController.create')
  })
    .prefix('/users')
    .middleware('auth:api')
  Route.group(() => {
    Route.get('/', 'DistrictsController.index')
    Route.get('/:id/substations', 'DistrictsController.getSubstations')
    Route.post('/', 'DistrictsController.store')
    Route.patch('/:id', 'DistrictsController.update')
    Route.delete('/:id', 'DistrictsController.destroy')
  })
    .prefix('/districts')
    // .middleware('auth:api')
  Route.group(() => {
    Route.get('/', 'VoltageClassesController.index')
    Route.post('/', 'VoltageClassesController.store')
    Route.patch('/:id', 'VoltageClassesController.update')
    Route.delete('/:id', 'VoltageClassesController.destroy')
  })
    .prefix('/voltage-classes')
    // .middleware('auth:api')
  Route.group(() => {
    Route.get('/', 'TypesKpsController.index')
    Route.get('/:id/substations', 'TypesKpsController.getSubstations')
    Route.post('/', 'TypesKpsController.store')
    Route.patch('/:id', 'TypesKpsController.update')
    Route.delete('/:id', 'TypesKpsController.destroy')
  })
    .prefix('/types-kp')
    // .middleware('auth:api')
  Route.group(() => {
    Route.get('/', 'HeadsController.index')
    Route.post('/', 'HeadsController.store')
    Route.get('/:id/substations', 'HeadsController.getSubstations')
    Route.patch('/:id', 'HeadsController.update')
    Route.delete('/:id', 'HeadsController.destroy')
  })
    .prefix('/head-controllers')
    .middleware('auth:api')
  Route.group(() => {
    Route.get('/', 'ChannelTypesController.index')
    Route.post('/', 'ChannelTypesController.store')
    Route.patch('/:id', 'ChannelTypesController.update')
    Route.delete('/:id', 'ChannelTypesController.destroy')
  })
    .prefix('/channel-types')
    .middleware('auth:api')
  Route.group(() => {
    Route.get('/', 'GsmOperatorsController.index')
    Route.get('/:id/substations', 'GsmOperatorsController.getSubstations')
    Route.post('/', 'GsmOperatorsController.store')
    Route.patch('/:id', 'GsmOperatorsController.update')
    Route.delete('/:id', 'GsmOperatorsController.destroy')
  })
    .prefix('/gsm-operators')
    .middleware('auth:api')

  Route.group(() => {
    Route.get('/', 'SubstationsController.index')
    Route.post('/', 'SubstationsController.store')
    Route.get('/:id/', 'SubstationsController.getInfoSubstation')
    Route.get('/:id/works', 'SubstationsController.getSubstationWorks')
    Route.patch('/:id', 'SubstationsController.update')
    Route.delete('/:id', 'SubstationsController.destroy')
  })
    .prefix('/substations')
    // .middleware('auth:api')
  Route.group(() => {
    Route.get('/', 'CompletedWorksController.index')
    Route.post('/', 'CompletedWorksController.store')
    Route.patch('/:id', 'CompletedWorksController.update')
    Route.delete('/:id', 'CompletedWorksController.destroy')
  })
    .prefix('/completed-works')
    .middleware('auth:api')
})
.namespace('App/Controllers/Http/Api/v1.0')
.prefix('/api/v1.0/')
