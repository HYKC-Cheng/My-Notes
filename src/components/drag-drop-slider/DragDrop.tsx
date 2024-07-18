import React, { useState } from 'react';
import { ReactSortable } from 'react-sortablejs';

interface Item {
  id: string;
  content: string;
  children?: Item[];
}

interface SortListProps {
  items: Item[];
  list: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  parentIds?: string[];
}

const SortList: React.FC<SortListProps> = ({
  list,
  items,
  setItems,
  parentIds,
}) => {
  const setList = (list: Item[]) => {
    const _parentIds = [...(parentIds || [])];

    if (_parentIds.length > 0) {
      setItems((prevItems) => {
        const _items = [...prevItems];

        const updateChild = (_list: Item[]) => {
          const parentId = _parentIds.shift();
          const parent = _list.find((item) => item.id === parentId);

          if (_parentIds.length && parent) {
            updateChild(parent.children || []);
          } else if (parent) {
            parent.children = list;
          }
        };

        updateChild(_items);

        return _items;
      });
    } else {
      setItems((_list) => {
        _list = list;
        return [..._list];
      });
    }
  };

  return (
    <ReactSortable
      group='nested'
      animation={150}
      fallbackOnBody
      swapThreshold={0.65}
      list={list}
      setList={setList}
      tag='ul'
    >
      {list.map((item) => (
        <li key={item.id}>
          <span className='handle'>☰</span> {item.content}
          {item.children && item.children.length > 0 && (
            <SortList
              parentIds={[...(parentIds || []), item.id]}
              list={item.children}
              items={items}
              setItems={setItems}
            />
          )}
        </li>
      ))}
    </ReactSortable>
  );
};

const App: React.FC = () => {
  const nestedItems: Item[] = [
    {
      id: 'item-1',
      content: 'Item 1',
      children: [
        {
          id: 'nested-1',
          content: 'Nested 1',
          children: [
            { id: 'nested-1-1', content: 'Nested 1-1' },
            { id: 'nested-2-1', content: 'Nested 2-1' },
          ],
        },
        { id: 'nested-2', content: 'Nested 2' },
      ],
    },
    {
      id: 'item-2',
      content: 'Item 2',
      children: [
        { id: 'nested-3', content: 'Nested 3' },
        { id: 'nested-4', content: 'Nested 4' },
      ],
    },
  ];

  const [list, setList] = useState<Item[]>(nestedItems);

  return <SortList list={list} items={list} setItems={setList} />;
};

export default App;
