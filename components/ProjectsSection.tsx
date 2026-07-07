
import React, { useMemo } from 'react';
import { ShoppingCart, X, Trash2 } from './icons';
import { CartItem, View } from '../App';


interface ShoppingCartProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onNavigate: (view: View) => void;
}

export const ShoppingCartComponent: React.FC<ShoppingCartProps> = ({ items, onRemoveItem, onCheckout, isOpen, setIsOpen, onNavigate }) => {

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);

  const toggleCart = () => setIsOpen(!isOpen);

  return (
    <>
      {!isOpen && (
        <button 
          onClick={toggleCart}
          className="fixed right-4 md:right-8 bottom-28 z-40 bg-purple-900/90 hover:bg-purple-800 text-green-400 border border-purple-500/50 font-bold font-mono uppercase tracking-widest py-3 px-6 rounded-sm transition-all duration-300 shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] transform hover:scale-105 backdrop-blur-sm flex items-center gap-2 group"
        >
          <ShoppingCart className="w-5 h-5 group-hover:text-white transition-colors" />
          <span>CART [{items.length}]</span>
        </button>
      )}

      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-black/95 backdrop-blur-xl shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-green-900/50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Tech decorative line */}
        <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-green-500/0 via-green-500/50 to-green-500/0"></div>

        <div className="flex flex-col h-full relative">
            {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-green-900/30 bg-green-900/5">
            <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-green-500" />
                <h2 className="text-xl font-bold text-green-400 font-mono uppercase tracking-widest">SYSTEM_CART</h2>
            </div>
            <button onClick={toggleCart} className="text-green-700 hover:text-green-400 transition-colors border border-transparent hover:border-green-500/30 rounded-sm p-1">
                <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
            {items.length === 0 ? (
              <div className="text-center pt-20 border border-dashed border-green-900/30 rounded-sm p-8 bg-green-900/5 mx-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-black border border-green-900/50 flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                    <ShoppingCart className="w-8 h-8 text-green-700" />
                </div>
                <p className="text-green-500 font-mono font-bold uppercase tracking-widest text-sm">NO DATA FOUND</p>
                <p className="text-green-800 text-xs font-mono uppercase mt-2">CART IS EMPTY.</p>
                
                <button 
                    onClick={() => { setIsOpen(false); onNavigate('store'); }}
                    className="mt-8 w-full bg-green-900/20 hover:bg-green-500 text-green-400 hover:text-black border border-green-700 hover:border-green-400 font-bold font-mono uppercase text-xs py-3 px-5 rounded-sm transition-all shadow-[0_0_10px_rgba(0,0,0,0)] hover:shadow-[0_0_15px_rgba(74,222,128,0.3)]"
                >
                    {">> RETURN_TO_STORE"}
                </button>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((item, index) => (
                  <li key={item.id} className="flex justify-between items-start bg-black/40 border border-green-900/30 p-3 rounded-sm hover:border-green-500/30 transition-colors group relative overflow-hidden animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                    {/* Tech corners */}
                    <div className="absolute top-0 left-0 w-1 h-1 border-l border-t border-green-500/30"></div>
                    <div className="absolute bottom-0 right-0 w-1 h-1 border-r border-b border-green-500/30"></div>

                    <div className="flex-1 pr-2 min-w-0">
                      <p className="font-bold text-green-400 font-mono text-sm truncate uppercase tracking-wide group-hover:text-green-300 transition-colors">{item.title}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="text-[10px] text-black bg-green-600 px-1.5 py-0.5 rounded-sm font-bold font-mono uppercase">{item.type === 'beat' ? 'BEAT' : 'KIT'}</span>
                          <span className="text-[10px] text-green-700 font-mono uppercase tracking-wider border border-green-900/30 px-1.5 py-0.5 rounded-sm bg-black/50">{item.description}</span>
                      </div>
                      <p className="text-sm font-bold text-green-500 font-mono mt-3">{`R$ ${item.price.toFixed(2)}`}</p>
                    </div>
                    <button onClick={() => onRemoveItem(item.id)} className="text-green-800 hover:text-red-500 p-2 transition-colors border border-transparent hover:border-red-500/30 rounded-sm">
                        <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 border-t border-green-900/30 bg-black/60 backdrop-blur-md">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-green-700 font-mono uppercase tracking-widest">TOTAL_VALUE</span>
                <span className="text-2xl font-bold text-green-400 font-mono tracking-wide drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">{`R$ ${total.toFixed(2)}`}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-green-600 hover:bg-green-500 text-black font-bold font-mono uppercase tracking-[0.2em] py-4 rounded-sm transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] border border-green-400 relative overflow-hidden group active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    INITIATE_CHECKOUT <span className="animate-pulse">_</span>
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </div>
          )}
        </div>
      </div>
       {isOpen && <div onClick={toggleCart} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 animate-fade-in"></div>}
    </>
  );
};

export default ShoppingCartComponent;
