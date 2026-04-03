import { renderHook, act } from '@testing-library/react';
import { useGroup } from '..';



interface TestGroup {
  key?    : string
  newKey? : string
}


describe('useGroup', () => {
  const INITIAL_GROUP: TestGroup = {
    key    : 'value',
    newKey : 'newValue'
  };

  // INITIAL EMPTY

  test('Initial empty', async () => {
    const { result } = renderHook(() => useGroup<TestGroup>());

    expect(result.current.open).toEqual(false);
    expect(result.current.isChanges).toEqual(false);
    expect(result.current.isConfirm).toEqual(false);

    const group = await result.current.getGroup();
    expect(group).toEqual({});
  });


  test('Initial empty & open = true', async () => {
    const { result } = renderHook(() => useGroup<TestGroup>({}, true));

    expect(result.current.open).toEqual(true);
    expect(result.current.isChanges).toEqual(false);
    expect(result.current.isConfirm).toEqual(false);

    const group = await result.current.getGroup();
    expect(group).toEqual({});
  });


  test('Initial empty & open = false, isChanges = true', async () => {
    const { result } = renderHook(() => useGroup<TestGroup>({}, false, true));

    expect(result.current.open).toEqual(false);
    expect(result.current.isChanges).toEqual(true);
    expect(result.current.isConfirm).toEqual(false);

    const group = await result.current.getGroup();
    expect(group).toEqual({});
  });

  // INITIAL WITH VALUE

  test('Initial with value', async () => {
    const { result } = renderHook(() => useGroup<TestGroup>(INITIAL_GROUP));

    expect(result.current.open).toEqual(false);
    expect(result.current.isChanges).toEqual(false);
    expect(result.current.isConfirm).toEqual(false);

    const group = await result.current.getGroup();
    expect(group).toEqual(INITIAL_GROUP);
  });


  test('Initial with value & open = true', async () => {
    const { result } = renderHook(() => useGroup<TestGroup>(INITIAL_GROUP, true));

    expect(result.current.open).toEqual(true);
    expect(result.current.isChanges).toEqual(false);
    expect(result.current.isConfirm).toEqual(false);

    const group = await result.current.getGroup();
    expect(group).toEqual(INITIAL_GROUP);
  });


  test('Initial with value & open = false, isChanges = true', async () => {
    const { result } = renderHook(() => useGroup<TestGroup>(INITIAL_GROUP, false, true));

    expect(result.current.open).toEqual(false);
    expect(result.current.isChanges).toEqual(true);
    expect(result.current.isConfirm).toEqual(false);

    const group = await result.current.getGroup();
    expect(group).toEqual(INITIAL_GROUP);
  });


  // SET GROUP

  test('should set and get group', async () => {
    const { result } = renderHook(() => useGroup<TestGroup>());

    act(() => result.current.setGroup({ key: 'value' }));

    const group = await result.current.getGroup();

    expect(group).toEqual({ key: 'value' });
    expect(result.current.open).toEqual(false);
    expect(result.current.isChanges).toEqual(true);
    expect(result.current.isConfirm).toEqual(false);
  });


  test('should set group with isChanges = false', async () => {
    const { result } = renderHook(() => useGroup<TestGroup>());

    act(() => result.current.setGroup({ key: 'value' }, { isChanges: false }));

    const group = await result.current.getGroup();

    expect(group).toEqual({ key: 'value' });
    expect(result.current.open).toEqual(false);
    expect(result.current.isChanges).toEqual(false);
  });


  test('should set group with isChanges = false, open = false', async () => {
    const { result } = renderHook(() => useGroup<TestGroup>());

    act(() => result.current.setGroup({ key: 'value' }, { isChanges: false, open: false }));

    const group = await result.current.getGroup();

    expect(group).toEqual({ key: 'value' });
    expect(result.current.open).toEqual(false);
    expect(result.current.isChanges).toEqual(false);
  });


  test('should set group with isChanges = false, open = true', async () => {
    const { result } = renderHook(() => useGroup<TestGroup>());

    act(() => result.current.setGroup({ key: 'value' }, { isChanges: false, open: true }));

    const group = await result.current.getGroup();

    expect(group).toEqual({ key: 'value' });
    expect(result.current.open).toEqual(true);
    expect(result.current.isChanges).toEqual(false);
  });


  test('should set group with isChanges = true, open = false', async () => {
    const { result } = renderHook(() => useGroup<TestGroup>());

    act(() => result.current.setGroup({ key: 'value' }, { isChanges: true, open: false }));

    const group = await result.current.getGroup();

    expect(group).toEqual({ key: 'value' });
    expect(result.current.open).toEqual(false);
    expect(result.current.isChanges).toEqual(true);
  });


  test('should set group with isChanges = true, open = true', async () => {
    const { result } = renderHook(() => useGroup<TestGroup>());

    act(() => result.current.setGroup({ key: 'value' }, { isChanges: true, open: true }));

    const group = await result.current.getGroup();

    expect(group).toEqual({ key: 'value' });
    expect(result.current.open).toEqual(true);
    expect(result.current.isChanges).toEqual(true);
  });


  // UPDATE GROUP

  test('should update group with partial changes', async () => {
    const { result } = renderHook(() => useGroup<TestGroup>());

    act(() => result.current.setGroup({ key: 'value' }));
    act(() => result.current.updateGroup({ newKey: 'newValue' }));

    const group = await result.current.getGroup();
    expect(group).toEqual(INITIAL_GROUP);
  });


  test('should update group with isChanges = false', async () => {
    const { result } = renderHook(() => useGroup<TestGroup>());

    act(() => result.current.updateGroup({ newKey: 'newValue' }, { isChanges: false }));

    const group = await result.current.getGroup();

    expect(group).toEqual({ newKey: 'newValue' });
    expect(result.current.open).toEqual(false);
    expect(result.current.isChanges).toEqual(false);
  });


  test('should update group with isChanges = false, open = false', async () => {
    const { result } = renderHook(() => useGroup<TestGroup>());

    act(() => result.current.updateGroup({ newKey: 'newValue' }, { isChanges: false, open: false }));

    const group = await result.current.getGroup();

    expect(group).toEqual({ newKey: 'newValue' });
    expect(result.current.open).toEqual(false);
    expect(result.current.isChanges).toEqual(false);
  });


  test('should update group with isChanges = false, open = true', async () => {
    const { result } = renderHook(() => useGroup<TestGroup>());

    act(() => result.current.updateGroup({ newKey: 'newValue' }, { isChanges: false, open: true }));

    const group = await result.current.getGroup();

    expect(group).toEqual({ newKey: 'newValue' });
    expect(result.current.open).toEqual(true);
    expect(result.current.isChanges).toEqual(false);
  });


  test('should update group with isChanges = true, open = false', async () => {
    const { result } = renderHook(() => useGroup<TestGroup>());

    act(() => result.current.updateGroup({ newKey: 'newValue' }, { isChanges: true, open: false }));

    const group = await result.current.getGroup();

    expect(group).toEqual({ newKey: 'newValue' });
    expect(result.current.open).toEqual(false);
    expect(result.current.isChanges).toEqual(true);
  });


  test('should update group with isChanges = true, open = true', async () => {
    const { result } = renderHook(() => useGroup<TestGroup>());

    act(() => result.current.updateGroup({ newKey: 'newValue' }, { isChanges: true, open: true }));

    const group = await result.current.getGroup();

    expect(group).toEqual({ newKey: 'newValue' });
    expect(result.current.open).toEqual(true);
    expect(result.current.isChanges).toEqual(true);
  });


  // SET OPEN CLOSE

  test('Test setOpen & setClose', async () => {
    const { result } = renderHook(() => useGroup<TestGroup>());

    expect(result.current.open).toEqual(false);
    expect(result.current.isChanges).toEqual(false);
    expect(result.current.isConfirm).toEqual(false);

    // Set Open
    act(() => result.current.setOpen());

    expect(result.current.open).toEqual(true);
    expect(result.current.isChanges).toEqual(false);
    expect(result.current.isConfirm).toEqual(false);

    // Set Close
    act(() => result.current.setClose());

    expect(result.current.open).toEqual(false);
    expect(result.current.isChanges).toEqual(false);
    expect(result.current.isConfirm).toEqual(false);
  });


  // SET IS CHANGES

  test('Test setIsChanges', async () => {
    const { result } = renderHook(() => useGroup<TestGroup>());
    expect(result.current.open).toEqual(false);
    expect(result.current.isChanges).toEqual(false);
    expect(result.current.isConfirm).toEqual(false);

    // setIsChanges with undefined
    act(() => result.current.setIsChanges());

    expect(result.current.open).toEqual(false);
    expect(result.current.isChanges).toEqual(false);
    expect(result.current.isConfirm).toEqual(false);

    // setIsChanges true
    act(() => result.current.setIsChanges(true));

    expect(result.current.open).toEqual(false);
    expect(result.current.isChanges).toEqual(true);
    expect(result.current.isConfirm).toEqual(false);

    // setIsChanges false
    act(() => result.current.setIsChanges(false));

    expect(result.current.open).toEqual(false);
    expect(result.current.isChanges).toEqual(false);
    expect(result.current.isConfirm).toEqual(false);
  });


  test('Test setIsConfirm', async () => {
    const { result } = renderHook(() => useGroup<TestGroup>());

    expect(result.current.open).toEqual(false);
    expect(result.current.isChanges).toEqual(false);
    expect(result.current.isConfirm).toEqual(false);

    // setIsConfirm true
    act(() => result.current.setIsConfirm(true));

    expect(result.current.open).toEqual(false);
    expect(result.current.isChanges).toEqual(false);
    expect(result.current.isConfirm).toEqual(true);

    // setIsConfirm false
    act(() => result.current.setIsConfirm(false));

    expect(result.current.open).toEqual(false);
    expect(result.current.isChanges).toEqual(false);
    expect(result.current.isConfirm).toEqual(false);
  });
});


// npm run test:unit use-group.test.ts
